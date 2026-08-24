import UIKit

/// Runs `NailDetector` against the checked-in `BenchmarkAssets` image set and
/// writes a JSON summary to Documents, so `scripts/bench-detect.sh` can pull
/// it via `simctl` and print a pass rate. Triggered by launching the app with
/// the `-benchDetect 1` argument (see NailousApp.swift); does nothing
/// otherwise, so normal app usage is unaffected.
enum DetectionBenchmark {
    static var isRequested: Bool {
        ProcessInfo.processInfo.arguments.contains("-benchDetect")
    }

    private struct ImageCase: Decodable {
        let file: String
        let expectedNails: Int
    }

    private struct Manifest: Decodable {
        let cases: [ImageCase]
    }

    private struct CaseResult: Encodable {
        let file: String
        let expectedNails: Int
        let detectedNails: Int
        let success: Bool
    }

    private struct Summary: Encodable {
        let total: Int
        let succeeded: Int
        let successRate: Double
        let results: [CaseResult]
    }

    static func run() async {
        let summary = await buildSummary()
        writeSummary(summary)
        print("BENCH_DONE \(summary.succeeded)/\(summary.total)")
    }

    private static func buildSummary() async -> Summary {
        guard let manifestURL = Bundle.main.url(forResource: "manifest", withExtension: "json"),
              let manifestData = try? Data(contentsOf: manifestURL),
              let manifest = try? JSONDecoder().decode(Manifest.self, from: manifestData)
        else {
            return Summary(total: 0, succeeded: 0, successRate: 0, results: [])
        }

        var results: [CaseResult] = []
        for testCase in manifest.cases {
            let baseName = (testCase.file as NSString).deletingPathExtension
            let ext = (testCase.file as NSString).pathExtension
            guard let imageURL = Bundle.main.url(forResource: baseName, withExtension: ext),
                  let data = try? Data(contentsOf: imageURL),
                  let image = UIImage(data: data)
            else {
                results.append(CaseResult(file: testCase.file, expectedNails: testCase.expectedNails, detectedNails: 0, success: false))
                continue
            }
            let detected = await NailDetector.detectNails(in: image)
            let success = detected.count == testCase.expectedNails
            results.append(CaseResult(file: testCase.file, expectedNails: testCase.expectedNails, detectedNails: detected.count, success: success))
        }

        let succeeded = results.filter(\.success).count
        let rate = results.isEmpty ? 0 : Double(succeeded) / Double(results.count)
        return Summary(total: results.count, succeeded: succeeded, successRate: rate, results: results)
    }

    private static func writeSummary(_ summary: Summary) {
        guard let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first,
              let data = try? JSONEncoder().encode(summary)
        else { return }
        let url = documents.appendingPathComponent("bench-results.json")
        try? data.write(to: url, options: .atomic)
    }
}

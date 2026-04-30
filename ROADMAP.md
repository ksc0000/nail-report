# Nail AI App - ロードマップ & 技術スタック（iOS版）

> **作成日**: 2026年4月
> **オーナー**: @ksc0000
> **リポジトリ**: https://github.com/ksc0000/nail-report
> **最終ゴール**: **iOSネイティブアプリとしてApp Storeに公開**

---

## 🎯 プロダクトビジョン

**「ネイルの瞬間を、ジュエリーのようにコレクションする」**

ユーザーが自分のネイル写真を簡単に美化・モデル化し、デジタルジュエリーボックスに収集。さらに、AIでオリジナルデザインを生成して新たな表現を楽しめる、**iPhone専用**のクリエイティブ&ソーシャルアプリ。

### なぜiOSネイティブか
- 🎨 **3D・AR表現の最高品質**: Metal/RealityKitで他では出せない表現力
- 🔒 **プライバシーへの信頼**: Apple Intelligence/Core MLでオンデバイス処理
- 💰 **ターゲット層の購買力**: ネイル文化が強い20-40代女性 × iPhoneシェア
- 📸 **カメラ・写真資産との統合**: PhotosフレームワークやLive Photos活用
- ✨ **App Storeのキュレーション**: 美しいアプリは特集されやすい

### コアバリュー
- 📸 **美化**: 雑な写真をサロン仕様に変換
- ✨ **生成**: 言葉やスケッチからオリジナルデザインを作成
- 💎 **収集**: 高級感ある3Dジュエリーボックスでコレクション
- 🤝 **共有**: 親しい友達と上品にシェア

### 競合との差別化
| アプリ | 主軸 | 弊社の強み |
|--------|------|----------|
| Instagram | 汎用SNS | ネイル特化、AI美化、コレクション体験 |
| YouCam Nails | バーチャル試着 | リアルなネイル記録、3Dジュエリーボックス |
| Noms（食事） | カジュアルな日常記録 | ジュエリー的な高級感・特別感 |

---

## 🗺️ 開発ロードマップ

### Phase 0: コンセプト検証（完了）
- [x] AIパース技術の調査
- [x] Nano Banana 2による美化変換プロトタイプ（Web）
- [x] 3DジュエリーボックスのプロトタイプWeb版 v1
- [x] iPhone Safariでの動作確認

### Phase 1: Webプロトタイプで体験を磨く（現在 〜 2026年6月）
**目標**: iOS実装前に体験設計を確定させる
- [x] 3Dジュエリーボックス v2（爪型修正、ゴールドフレーム、環境マッピング）
- [ ] レイアウトモード3種（Sphere/Grid/Spiral）の評価
- [ ] スキン4種のクオリティ調整
- [ ] 詳細表示の中央フォーカス演出
- [ ] 写真変換機能（Nano Banana 2 API）の精度評価
- [ ] サンプルネイルデザイン20件の用意
- [ ] **5名以上のターゲットユーザーへのヒアリング**

**成果物**: 公開可能なWebデモ + 体験仕様書（Swift実装の指針となる）

### Phase 2: iOSネイティブ版の基盤構築（2026年7月 〜 2026年9月）
**目標**: Webと同等以上の体験をiOSで再現
- [ ] Xcodeプロジェクトセットアップ（SwiftUI + iOS 18最低）
- [ ] **3Dジュエリーボックスを RealityKit / SceneKit で実装**
- [ ] カメラ撮影 → Photosライブラリ保存のフロー
- [ ] Gemini API連携（URLSession経由、APIキーはバックエンド経由）
- [ ] 美化変換機能のSwift実装
- [ ] オリジナル生成機能のSwift実装
- [ ] SwiftDataでローカル永続化

**成果物**: 内部TestFlight配布版

### Phase 3: MVP完成 & App Store公開（2026年10月 〜 2026年12月）
**目標**: ストア公開可能な品質に
- [ ] オンボーディング設計
- [ ] iCloud同期（CloudKit）
- [ ] Sign in with Apple
- [ ] 共有機能（ShareLink、Live Photos対応）
- [ ] ホーム画面ウィジェット（最近のネイル表示）
- [ ] Dynamic Island対応（生成中のステータス）
- [ ] App Storeスクリーンショット・プロモビデオ作成
- [ ] **App Store Review対応・公開**

**成果物**: App Store公開、初期ユーザー1,000人

### Phase 4: AI高度化 & オンデバイス化（2027年1月 〜 2027年6月）
**目標**: プライバシーと品質、コストを両立
- [ ] **Core ML + ml-stable-diffusion** でオンデバイス生成
- [ ] **MobileNetV2** ベースの爪セグメンテーション統合
- [ ] **DreamLite**（0.39B、iPhone 17 Proで3秒生成）の検証
- [ ] Apple Intelligence統合（Image Playground連携の可能性）
- [ ] ハイブリッド戦略：高品質はクラウド、ベーシックはオンデバイス
- [ ] Vision Framework で爪領域自動検出

**成果物**: APIコスト50%削減、オフライン動作対応

### Phase 5: AR & ソーシャル機能（2027年7月 〜 2027年12月）
**目標**: ネイル版Instagramの実現と没入体験
- [ ] **ARKit** で実際の手にデザイン投影（バーチャル試着）
- [ ] **Vision Pro対応**（空間にジュエリーボックスを配置）
- [ ] 友達フォロー機能（Sign in with Apple ID連携）
- [ ] フィード表示
- [ ] リアクション・コメント
- [ ] 月間ハイライト動画の自動生成（AVFoundation）
- [ ] ネイルサロン連携（予約、レビュー）

**成果物**: MAU 1万人、コミュニティ形成

### Phase 6: マーケット & 拡張（2028年〜）
**目標**: プラットフォーム化
- [ ] ユーザー作成デザインのマーケットプレイス
- [ ] プロネイリスト出品機能
- [ ] StoreKit 2でアプリ内決済
- [ ] サロン向けB2Bツール
- [ ] iPad / Macアプリ対応（SwiftUIでマルチプラットフォーム）
- [ ] **Android版の検討**（需要を見て判断）

**成果物**: MAU 10万人、サブスク収益安定化

---

## 🛠️ 技術スタック

### Phase 1（現在: Webプロトタイプ）

#### フロントエンド
| 技術 | 用途 | 選定理由 |
|------|------|---------|
| HTML/CSS/JavaScript（Vanilla） | プロトタイプの基盤 | 軽量、依存なし、すぐ動く |
| Three.js (r160) | 3Dジュエリーボックス | iOS実装前の体験検証 |
| Canvas API | 爪テクスチャ動的生成 | 軽量、Web向け |

#### AI / 画像生成
| 技術 | 用途 | 価格 |
|------|------|------|
| Gemini API (Nano Banana 2) | 美化変換・生成 | $0.045/枚〜 |
| Google AI Studio 無料枠 | 検証段階 | 〜500枚/日 |

#### ホスティング
| 技術 | 用途 |
|------|------|
| GitHub Pages | プロトタイプ公開 |

> **注**: Phase 1の成果物はあくまで体験検証用。Swift実装時にコード資産は流用しないが、**UX設計・プロンプト・3Dシーンのパラメータは仕様書として継承**する。

---

### Phase 2-3（iOS MVP）

#### iOS開発
| 技術 | 用途 | 選定理由 |
|------|------|---------|
| **Swift 6** | メイン言語 | Apple純正、最新の並行処理 |
| **SwiftUI** | UI構築 | 宣言的、iOSの最新UI機能をフル活用 |
| **Xcode 16+** | 開発環境 | 必須 |
| **iOS 18+** | 最低サポート | 最新機能を活用、ターゲット層は新機種ユーザー多い |

#### 3Dレンダリング
| 技術 | 用途 | 選定理由 |
|------|------|---------|
| **RealityKit** | メインの3D表現 | Apple純正、ARとの統合容易、Metal最適化済み |
| **SceneKit**（補助） | より細かい制御が必要な箇所 | 成熟したAPI |
| **Metal**（必要時） | カスタムシェーダー | 最高パフォーマンス |

> **判断**: RealityKitを第一選択にする。Three.jsで作った3Dシーンは**RealityKitのEntity/Componentに置き換えて再構築**する。

#### カメラ・画像
| 技術 | 用途 |
|------|------|
| **AVFoundation** | カメラ撮影 |
| **PhotoKit** | 写真ライブラリアクセス |
| **Vision Framework** | 爪領域検出（Phase 4で本格活用） |
| **Core Image** | 画像前処理・フィルタ |

#### データ永続化
| 技術 | 用途 |
|------|------|
| **SwiftData** | ローカルDB（iOS 17+の新標準） |
| **CloudKit** | iCloud同期 |
| **FileManager** | 画像ファイル管理 |

#### ネットワーク・API
| 技術 | 用途 |
|------|------|
| **URLSession** | API通信 |
| **async/await** | 非同期処理 |
| **Codable** | JSON処理 |

#### バックエンド（APIキー保護用）
| 技術 | 用途 | 選定理由 |
|------|------|---------|
| **Cloudflare Workers** | Gemini API中継・APIキー保護 | 安価、グローバル分散 |
| **Supabase**（代替） | 認証も含めて統合管理したい場合 | iOS SDK充実 |

#### AI（クラウド）
| 技術 | 用途 |
|------|------|
| **Gemini API (Nano Banana 2)** | 美化変換、オリジナル生成 |
| **Gemini API (Nano Banana Pro)** | 高品質4K（必要時） |

---

### Phase 4（オンデバイスAI）

| 技術 | 用途 |
|------|------|
| **Core ML** | オンデバイス推論基盤 |
| **ml-stable-diffusion** | Stable DiffusionをCore ML化（Apple公式） |
| **DreamLite** | 軽量画像生成（iPhone 17 Proで3秒/枚） |
| **Create ML** | カスタムモデルの学習 |
| **Vision Framework** | 爪セグメンテーション |
| **MobileNetV2** | 軽量分類モデル |
| **Apple Intelligence** | Image Playground連携の可能性 |

---

### Phase 5（AR・ソーシャル）

#### AR
| 技術 | 用途 |
|------|------|
| **ARKit 7+** | 手の追跡、バーチャル試着 |
| **Vision Pro / visionOS** | 空間ジュエリーボックス |
| **RoomPlan**（参考） | 空間認識 |

#### ソーシャル・バックエンド
| 技術 | 用途 |
|------|------|
| **Supabase** または **Firebase** | 認証、DB、リアルタイム |
| **CloudKit Sharing** | 友達間データ共有 |
| **Sign in with Apple** | 認証（必須、App Store要件） |
| **AWS S3 / Cloudflare R2** | 画像ストレージ |

#### メディア生成
| 技術 | 用途 |
|------|------|
| **AVFoundation** | 月間ハイライト動画生成 |
| **Core Animation** | ハイライト動画のアニメーション |

---

## 🎨 デザインシステム

### iOS固有のデザイン原則
1. **Human Interface Guidelinesを尊重**: 違和感のない操作感
2. **SF Symbolsを活用**: 統一感のあるアイコン
3. **Dynamic Type対応**: アクセシビリティ
4. **Dark Mode完全対応**: ジュエリーボックスの世界観と相性◎
5. **触覚フィードバック**: Core Hapticsでネイルタップ時の質感
6. **Live Activities**: 生成中の状態をDynamic Islandで表示

### カラーパレット（プロトタイプから継承）
```swift
// SwiftUI Color定義例
extension Color {
    static let nailPrimary = Color(hex: "ec407a")
    static let nailDeep = Color(hex: "c2185b")
    static let nailSoft = Color(hex: "f8bbd0")
    static let nailBg = Color(hex: "fce4ec")
    static let nailGold = Color(hex: "ffd700")
    static let nailDark = Color(hex: "050308")
}
```

### デザイン原則
1. **ピンクベースだが甘すぎない**: ネイビー・ゴールドで引き締める
2. **グラスモーフィズム**: `.ultraThinMaterial` で上品さを演出
3. **少ない情報密度**: 1画面に詰め込まない、余白を活かす
4. **動きで価値を表現**: SwiftUIのアニメーション、RealityKitの没入感
5. **マイクロインタラクション**: Core Hapticsで触感を伝える

---

## 📊 KPI / 成功指標

### Phase 1-2（プロトタイプ・基盤）
- [ ] iPhone 15以降で60fps維持
- [ ] 美化変換の主観品質 → 5段階で4以上
- [ ] 1セッション平均利用時間 5分以上
- [ ] ユーザーテストで「ジュエリー感ある」と評価される

### Phase 3（App Store公開）
- [ ] App Store評価 4.5以上
- [ ] 初週ダウンロード 1,000件
- [ ] クラッシュフリー率 99.5%以上
- [ ] 平均セッション時間 3分以上

### Phase 4-5（成熟期）
- [ ] MAU 1万人 → 10万人
- [ ] 有料サブスク転換率 5%以上
- [ ] 平均セッション数 週3回以上
- [ ] App Store「今日のApp」選出

---

## 💰 マネタイズ戦略

### 主な収益源
1. **フリーミアム**（StoreKit 2で実装）
   - 無料: 月10枚生成、基本スキン4種
   - PRO（¥980/月、または ¥9,800/年）: 無制限生成、全スキン解放、4K出力、広告なし
2. **B2Bパートナーシップ**
   - ネイルサロン向けデザイン共有プラットフォーム
   - 予約システム連携手数料
3. **デザインマーケット**（Phase 6以降）
   - ユーザー作成デザインの販売プラットフォーム
   - プロネイリスト出品手数料（Apple手数料15-30%考慮）

### コスト構造
- **AI API利用料**（最大の変動費、Phase 4でオンデバイス化により削減）
- **Apple Developer Program**: $99/年
- **バックエンド・ストレージ**
- **開発・運用人件費**

### 単価試算
- 1ユーザー月10枚生成 = $0.45 のAPIコスト
- PROプランなら粗利率高い（オンデバイス比率を上げるほど健全）

---

## ⚠️ リスク & 対策

| リスク | 対策 |
|-------|------|
| **AI API価格変動** | Phase 4で計画的にオンデバイス化を進める |
| **生成品質のばらつき** | プロンプトテンプレートのライブラリ化、品質フィルタリング |
| **コピー商品の登場** | コミュニティ形成を優先、ブランド体験で差別化 |
| **App Store審査リジェクト** | HIG準拠、プライバシーポリシー整備、初期から審査ガイドラインを意識 |
| **3D性能の端末差** | iPhone 13以降を最低要件化、それ未満は2Dビューにフォールバック |
| **iOSバージョン依存** | iOS 18+を最低要件、最新APIを積極活用 |
| **Webプロトの資産が流用できない** | Webは「体験仕様書」と割り切り、Swift実装で再構築 |

---

## 🤝 開発体制（想定）

### 必要な役割
- **プロダクトオーナー**: @ksc0000
- **iOSエンジニア**（SwiftUI、RealityKit経験必須）
- **AIエンジニア**（プロンプトエンジニアリング、Core ML経験者）
- **UI/UXデザイナー**（iOS HIG理解、高級感の表現）
- **ネイリスト監修**(リアリティとトレンドの担保)

### 開発手法
- **Phase 1**: コーディングエージェント活用でWeb版を高速反復
- **Phase 2以降**: Xcode + Claude Code等でiOS実装
- **2週間スプリント**: プロトタイプ→検証→改善
- **TestFlight早期活用**: Phase 2から内部配布で実機検証
- **ドッグフーディング**: オーナー自身がヘビーユーザーになる

### コーディングエージェントへの渡し方
```
Phase 1: Web版の改善
└─ READMEとROADMAPを読み、prototype/jewelry-box.htmlを改善

Phase 2: iOS版の実装
└─ Web版の体験仕様書（このROADMAPの該当セクション）を読み、
   SwiftUI + RealityKitで再実装。Three.jsのコードは参考程度。
```

---

## 📚 参考リソース

### iOS開発
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [RealityKit Documentation](https://developer.apple.com/documentation/realitykit)
- [WWDC Sessions](https://developer.apple.com/videos/)

### AI（オンデバイス）
- [Apple ml-stable-diffusion](https://github.com/apple/ml-stable-diffusion)
- [Core ML Models](https://developer.apple.com/machine-learning/models/)
- [DreamLite GitHub](https://github.com/ByteVisionLab/DreamLite)
- [Apple Intelligence](https://developer.apple.com/apple-intelligence/)

### AI（クラウド）
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Nano Banana 2 公式](https://ai.google.dev/gemini-api/docs/image-generation)

### 競合・参考アプリ
- Noms（食事日記、コレクション体験の参考）
- YouCam Nails

### ネイルセグメンテーション研究
- Nail Polish Try-On (arXiv:1906.02222)

---

## 📅 直近の意思決定事項

### 今週中に決めたいこと
- [ ] プロトタイプv2のフィードバック収集（実機テスト）
- [ ] サンプル画像の準備方法（フリー素材 vs 自前撮影）

### 今月中に決めたいこと
- [ ] Web Phase 1の完了基準を明文化
- [ ] iOS開発のスタート時期決定
- [ ] iOSエンジニアの確保（自分で書く / 委託 / コーディングエージェント中心）

### 次クォーター中に決めたいこと
- [ ] Apple Developer Program登録（Phase 2開始時に必須、$99/年）
- [ ] Xcodeプロジェクト構成の決定
- [ ] β版テスター募集（TestFlight）
- [ ] サロン提携の最初の1社

---

## 🍎 iOS特有の準備事項

### 開発開始前に必要なもの
- [ ] **Apple Developer Program** 加入（$99/年）
- [ ] **Macの確保**（XcodeはmacOSでしか動かない）
- [ ] **テスト用iPhone**（iPhone 13以降推奨、最新機種が望ましい）
- [ ] **Xcode 16以降のインストール**

### App Store審査で気をつけること
- [ ] **プライバシーポリシー**整備（生成画像の扱いを明記）
- [ ] **利用規約**整備（ユーザー作成コンテンツの権利関係）
- [ ] **AI生成コンテンツの開示**（App Store Review Guidelines 5.1.1）
- [ ] **Sign in with Apple**実装（他SNSログインを使う場合の必須要件）
- [ ] **App Tracking Transparency** 対応（広告ID使う場合）
- [ ] **In-App Purchase**で課金（外部決済リンク禁止）
- [ ] **適切な年齢レーティング**設定

### 申請に必要なアセット
- [ ] アプリアイコン（1024×1024）
- [ ] スクリーンショット（各デバイスサイズ）
- [ ] プロモーション動画（任意だが効果的）
- [ ] アプリ名・説明文（日本語・英語）
- [ ] キーワード設定

---

## 📝 改訂履歴

| 日付 | 内容 |
|------|------|
| 2026-04-30 | 初版作成（Web中心） |
| 2026-04-30 | iOSネイティブ前提に全面改訂 |

---

## 💌 お問い合わせ

このロードマップに関する質問・提案は、リポジトリのIssueまでお願いします。

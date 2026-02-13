# 🌙 サラちゃんのトイトレ 〜The Sleepy Forest〜

2歳のサラちゃんのトイレトレーニングアプリ。
The Sleepy Forestのバンドメンバーたちが応援してくれます！

## 🎸 バンドメンバー

| キャラクター | 名前 | 楽器 | ガイド担当 |
|---|---|---|---|
| 🦄 ペガサス | ルミネ | ボーカル | そつぎょう期 |
| 🦁 ライオン | レオン | ギター | チャレンジ期 |
| 🐰 うさぎ | リズ | タンバリン | こえかけ期 |
| 🐻 くま | ブルーノ | ドラム | じゅんび期 |
| 🦄 ユニコーン | メロディ | キーボード | じぶんで期 |
| 🐸 かえる | エコー | DJ | サポート |
| 🐑 ひつじ | ひつじさん | コーラス | サポート |

## 🏰 ゴール

**4月29日 ディズニーランド！**
トイトレ卒業したらディズニーに行こうね！

## 🚀 Vercelデプロイ手順

### 方法1: GitHub経由（推奨）

1. このフォルダをGitHubリポジトリにプッシュ
   ```bash
   cd sara-toitore
   git init
   git add .
   git commit -m "🌙 Sara's toilet training app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sara-toitore.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) にログイン

3. 「Add New Project」→ GitHubリポジトリを選択

4. そのまま「Deploy」をクリック

5. 完了！URLが発行されます 🎉

### 方法2: Vercel CLI

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトフォルダで実行
cd sara-toitore
vercel

# プロンプトに従って設定
# → 完了するとURLが発行されます
```

## 📱 使い方

- **ホーム**: 「できた！」「がんばった！」でワンタップ記録
- **きろく**: 今日のログ＆トータル統計
- **グラフ**: 1週間の推移
- **プラン**: 5フェーズのロードマップ
- **シール**: 成功3回ごとにごほうびシール

## 💡 Tips

- スマホのホーム画面に追加すると、アプリのように使えます
- 夫婦で同じURLにアクセスすれば、それぞれのスマホで使えます
  - ※データはlocalStorageに保存されるため、デバイスごとに独立です

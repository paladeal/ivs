# VoiceVox音声合成セットアップガイド

## 概要
VoiceVoxは無料で使える高品質な日本語音声合成エンジンです。より人間らしい音声を生成できます。

## セットアップ方法

### 1. VoiceVoxのダウンロードとインストール

#### macOSの場合
```bash
# Homebrewを使用してインストール
brew install --cask voicevox

# または公式サイトからダウンロード
# https://voicevox.hiroshiba.jp/
```

#### Dockerを使用する場合（推奨）
```bash
# VoiceVoxのDockerイメージを起動
docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest

# GPUを使用する場合
docker run --rm --gpus all -p 50021:50021 voicevox/voicevox_engine:nvidia-ubuntu20.04-latest
```

### 2. 環境変数の設定
`.env.local`ファイルに以下を追加：
```
VOICEVOX_URL=http://localhost:50021
```

### 3. 利用可能な話者

- `normal`: ずんだもん（ノーマル）
- `happy`: ずんだもん（あまあま）
- `tsundere`: ずんだもん（ツンツン）
- `whisper`: ずんだもん（ささやき）
- `male_normal`: 青山龍星
- `female_normal`: 冥鳴ひまり
- `girl_normal`: 四国めたん（ノーマル）
- `boy_normal`: 春日部つむぎ

## フォールバック機能

VoiceVoxが利用できない場合、自動的にブラウザの音声合成にフォールバックします。

## トラブルシューティング

### VoiceVoxに接続できない場合
1. VoiceVoxが起動しているか確認
2. ポート50021が開いているか確認
3. ファイアウォールの設定を確認

### 音声が再生されない場合
1. ブラウザの音声再生権限を確認
2. 音量設定を確認
3. コンソールログでエラーを確認
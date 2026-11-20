# -*- coding: utf-8 -*-
import os
import sys
import subprocess

def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("=" * 65)
    print("  🎵 OSCARMARK2007 - YouTube 轉 320kbps 高音質 MP3 專業工具")
    print("=" * 65)
    print("說明：")
    print("1. 支援所有 YouTube 影片、音樂、MV、Podcast 網址。")
    print("2. 自動以最高音質串流下載，並以 FFmpeg 壓制為 320kbps MP3。")
    print("3. 自動寫入高畫質封面 (Thumbnail) 與 ID3 歌曲標籤資訊。")
    print("4. 下載完成後自動存放於「下載的320k音樂 (MP3)」資料夾。")
    print("=" * 65 + "\n")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "下載的320k音樂 (MP3)")
    os.makedirs(output_dir, exist_ok=True)
    ffmpeg_exe = os.path.join(base_dir, "ffmpeg.exe")

    if not os.path.exists(ffmpeg_exe):
        try:
            import imageio_ffmpeg
            ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            ffmpeg_exe = "ffmpeg"

    while True:
        try:
            url = input("👉 請貼上 YouTube 網址 (輸入 Q 退出): ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if not url:
            continue
        if url.lower() in ['q', 'exit', 'quit']:
            break

        print(f"\n⏳ 正在分析影片並提取最高音質音訊...")
        print(f"📁 儲存目錄: {output_dir}\n")

        output_template = os.path.join(output_dir, "%(title)s.%(ext)s")

        cmd = [
            sys.executable, "-m", "yt_dlp",
            "--ffmpeg-location", ffmpeg_exe,
            "-x",
            "--audio-format", "mp3",
            "--audio-quality", "320k",
            "--embed-thumbnail",
            "--add-metadata",
            "--no-playlist",
            "-o", output_template,
            url
        ]

        try:
            res = subprocess.run(cmd)
            if res.returncode == 0:
                print("\n" + "=" * 65)
                print("🎉 【轉檔成功】320kbps MP3 音樂已下載完成！")
                print(f"📂 檔案存放於: {output_dir}")
                print("=" * 65 + "\n")
                # Open directory in Windows explorer
                if os.name == 'nt':
                    try:
                        os.startfile(output_dir)
                    except Exception:
                        pass
            else:
                print("\n❌ 轉檔過程發生錯誤，請檢查網址是否正確或具有版權限制。\n")
        except Exception as e:
            print(f"\n❌ 執行失敗: {e}\n")

        print("-" * 65)

if __name__ == '__main__':
    main()

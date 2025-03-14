import { detectSystemInfo, handleFile, updateFile } from './../dist/utils.js';
import { Innertube, UniversalCache } from 'youtubei.js';
import { execFile } from 'child_process';
import axios from 'axios';
import ai from './ia/index.js';
import path from 'path';
import fs from 'fs';
import os from 'os';

updateFile();

const tempPath = path.join(__dirname, '../temp');
const tempDirSystem = os.tmpdir();
let PathErDL = '';

function loadAndShuffleCookies() {
  const cookiesPath = path.join(__dirname, '../dist/cookies.json');
  const cookiesArray = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
  return cookiesArray.sort(() => Math.random() - 0.5);
}

async function findValidCookie() {
  const cookiesArray = loadAndShuffleCookies();
  const testedCookies = new Set();
  for (const cookie of cookiesArray) {
    if (testedCookies.has(cookie)) continue;
    const tempCookiePath = path.join(__dirname, '../dist/cookie.txt');
    fs.writeFileSync(tempCookiePath, cookie);
    const isValid = await testCookie(tempCookiePath);
    testedCookies.add(cookie);
    if (isValid) {
      return tempCookiePath;
    }
  }
  throw new Error('❌ [ERROR] Tidak ada cookie valid yang ditemukan');
}

async function testCookie(cookiePath) {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const args = ['--no-cache-dir', '-F', '--cookies', cookiePath, url];
  return new Promise((resolve, reject) => {
    execFile(PathErDL, args, (error, stdout, stderr) => {
      if (error) {
        if (PathErDL.includes('ErLib_py')) {
          execFile(
            'python',
            [PathErDL, ...args],
            (pyErr, pyStdout, pyStderr) => {
              if (pyErr) {
                if (
                  pyStderr.includes('This content isn') ||
                  pyErr?.message?.includes('This content isn')
                ) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              } else {
                resolve(true);
              }
            }
          );
        } else if (
          stderr.includes('This content isn') ||
          error?.message?.includes('This content isn')
        ) {
          resolve(false);
        } else {
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  });
}

detectSystemInfo((error, architecture, platform) => {
  if (error)
    return console.error(
      `❌ [ERROR] Gagal mendeteksi sistem: ${error.message}`
    );
  if (platform === 'android') {
    PathErDL = path.join(__dirname, '../bin/ErLib_py');

    console.log(`📱 [PLATFORM] Sistem Android terdeteksi.`);

    console.log(
      `🚀 [@er-npm/scraper] Modul diinisialisasi dengan Python untuk Android.`
    );
    return;
  }
  if (platform !== 'linux' && platform !== 'win32') {
    return console.error(
      `❌ [PLATFORM] Modul ini hanya kompatibel dengan sistem Linux, Android, dan Windows.`
    );
  }
  console.log(`✅ [PLATFORM] Sistem terdeteksi: ${platform}.`);

  switch (architecture) {
    case 'x64':
      PathErDL = path.join(
        __dirname,
        platform === 'win32' ? '../bin/ErLib_win_x64.zip' : '../bin/ErLib'
      );
      console.log(`💻 [ARSITEKTUR] Arsitektur x64 terdeteksi.`);
      break;
    case 'arm':
      PathErDL = path.join(__dirname, '../bin/ErLib_v7');
      console.log(`🤖 [ARSITEKTUR] Arsitektur ARM terdeteksi.`);
      break;
    case 'arm64':
      PathErDL = path.join(__dirname, '../bin/ErLib_64');
      console.log(`🔧 [ARSITEKTUR] Arsitektur ARM64 terdeteksi.`);
      break;
    case 'x86':
      PathErDL = path.join(__dirname, '../bin/ErLib_win_x86.zip');
      console.log(`💻 [ARSITEKTUR] Arsitektur x86 terdeteksi.`);
      break;
    default:
      console.error(
        `❌ [ARSITEKTUR] Arsitektur tidak didukung: ${architecture}`
      );
      return;
  }

  console.log(
    `✅ [@er-npm/scraper] Modul berhasil diinisialisasi pada arsitektur: ${architecture}.`
  );
});

async function processOutput(args, tempFile) {
  return new Promise((resolve, reject) => {
    execFile(PathErDL, args, (err, stdout, stderr) => {
      if (err) {
        if (PathErDL.includes('ErLib_py')) {
          execFile(
            'python',
            [PathErDL, ...args],
            (pyErr, pyStdout, pyStderr) => {
              if (pyErr) {
                reject(
                  `Percobaan gagal. Mencoba lagi... ${pyStderr || pyErr.message}`
                );
              } else {
                handleFile(tempFile, resolve, reject);
              }
            }
          );
        } else {
          reject(`ErLib error: ${stderr || err.message}`);
        }
      } else {
        handleFile(tempFile, resolve, reject);
      }
    });
  });
}

async function ermp3(url) {
  const base64Url = 'aHR0cHM6Ly9lci1hcGkuYml6LmlkL2RsL2VybXAzP3U9';
  const decodedUrl = atob(base64Url);
  const apiUrl = `${decodedUrl}${url}`;

  try {
    const response = await axios.get(apiUrl);
    const hasil = Array.isArray(response.data.hasil)
      ? response.data.hasil[0]
      : null;

    return {
      status: true,
      judul: hasil?.judul || 'Judul tidak ditemukan',
      url: hasil?.link_download || 'Link tidak tersedia',
      from: '@er-npm/scraper'
    };
  } catch (error) {
    console.log('Error:', error); // Debugging: lihat error di console

    return {
      status: false,
      why: 'eror njing. ' + error.message,
      terus_gmna: 'visit: t.me/er_support_group'
    };
  }
}

//Contoh penggunaan
// const url = "https://www.youtube.com/watch?v=vx2u5uUu3DE";
// ermp3(url).then(result => console.log(result));

async function ermp4(url) {
  const base64Url = 'aHR0cHM6Ly9lci1hcGkuYml6LmlkL2RsL2VybXA0P3U9';
  const decodedUrl = atob(base64Url);
  const apiUrl = `${decodedUrl}${url}`;

  try {
    const response = await axios.get(apiUrl);
    const hasil = Array.isArray(response.data.hasil)
      ? response.data.hasil[0]
      : null;

    return {
      status: true,
      judul: hasil?.judul || 'Judul tidak ditemukan',
      url: hasil?.link_download || 'Link tidak tersedia',
      from: '@er-npm/scraper'
    };
  } catch (error) {
    console.log('Error:', error); // Debugging: lihat error di console

    return {
      status: false,
      why: 'eror njing. ' + error.message,
      terus_gmna: 'visit: t.me/er_support_group'
    };
  }
}

async function convertToCompatibleVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg error:', stderr || error.message);
        return reject(error);
      }
      resolve();
    });
  });
}

async function yts(query) {
  await clearSystemTempDir();
  const yt = await Innertube.create({ cache: new UniversalCache() });
  const search = await yt.search(query);
  return search;
}

async function samehadakuSearch(query) {
  const url = `https://api.siputzx.my.id/api/anime/samehadaku/search?query=${encodeURIComponent(query)}`;
  try {
    const res = await axios.get(url);
    const data = res.data.data; // Ambil array data anime

    if (!Array.isArray(data) || data.length === 0) {
      return {
        status: false,
        why: 'Anime tidak ditemukan.',
        terus_gmna: 'visit: t.me/chakszzz'
      };
    }

    return {
      status: true,
      results: data.map(anime => ({
        title: anime.title,
        id: anime.id,
        thumbnail: anime.thumbnail,
        description: anime.description,
        genre: anime.genre.join(', '), // Gabungkan array genre jadi string
        type: anime.type.join(', '), // Gabungkan array type jadi string
        rating: anime.star,
        views: anime.views,
        link: anime.link
      })),
      from: '@er-npm/scraper'
    };
  } catch (error) {
    return {
      status: false,
      why: 'Error njing.',
      terus_gmna: 'visit: t.me/chakszzz'
    };
  }
}

async function samehadakuDL(url) {
  const apiUrl = `https://api.siputzx.my.id/api/anime/samehadaku/download?url=${encodeURIComponent(url)}`;

  try {
    const res = await axios.get(apiUrl);
    const data = res.data.data; // Mengambil objek data utama

    // Cek apakah data valid dan memiliki link download
    if (
      !data ||
      !Array.isArray(data.downloads) ||
      data.downloads.length === 0
    ) {
      return {
        status: false,
        why: 'Link download tidak ditemukan.',
        terus_gmna: 'visit: t.me/chakszzz'
      };
    }

    // Mapping hasil download ke format yang lebih sederhana
    return {
      status: true,
      title: data.title, // Judul anime
      link: data.link, // Link halaman anime
      downloads: data.downloads.map(dl => ({
        name: dl.name, // Nama sumber download
        type: dl.type, // Jenis format download
        quality: dl.nume, // Kualitas video
        download_link: dl.link // URL download
      })),
      from: '@er-npm/scraper' // Sumber data
    };
  } catch (error) {
    return {
      status: false,
      why: 'Error njing.',
      terus_gmna: 'visit: t.me/chakszzz'
    };
  }
}

async function tiktokDl(url) {
  return new Promise((resolve, reject) => {
    // <- Tambahkan `=>` setelah reject
    try {
      let data = [];

      function formatNumber(integer) {
        let numb = parseInt(integer);
        return Number(numb).toLocaleString().replace(/,/g, '.');
      }

      function formatDate(n, locale = 'en') {
        let d = new Date(n * 1000);
        return d.toLocaleDateString(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
      }

      let domain = 'https://www.tikwm.com/api/';
      let startTime = Date.now();

      axios
        .post(
          domain,
          {},
          {
            headers: {
              'Accept': 'application/json, text/javascript, */*; q=0.01',
              'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
              'Origin': 'https://www.tikwm.com',
              'Referer': 'https://www.tikwm.com/',
              'Sec-Ch-Ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
              'Sec-Ch-Ua-Mobile': '?1',
              'Sec-Ch-Ua-Platform': 'Android',
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'User-Agent':
                'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
              'X-Requested-With': 'XMLHttpRequest'
            },
            params: {
              url: url,
              count: 12,
              cursor: 0,
              web: 1,
              hd: 1
            }
          }
        )
        .then(response => {
          let res = response.data.data;
          let responseTime = Date.now() - startTime;

          if (res && !res.size && !res.wm_size && !res.hd_size) {
            res.images?.forEach(v => {
              data.push({ type: 'photo', url: v });
            });
          } else {
            if (res?.wmplay) {
              data.push({
                type: 'watermark',
                url: 'https://www.tikwm.com' + res.wmplay
              });
            }
            if (res?.play) {
              data.push({
                type: 'nowatermark',
                url: 'https://www.tikwm.com' + res.play
              });
            }
            if (res?.hdplay) {
              data.push({
                type: 'nowatermark_hd',
                url: 'https://www.tikwm.com' + res.hdplay
              });
            }
          }

          let json = {
            status: true,
            taken_at: res.create_time
              ? formatDate(res.create_time).replace('1970', '')
              : 'Unknown',
            region: res.region,
            data: data,
            song_info: {
              author: res.music_info?.author,
              album: res.music_info?.album || null,
              url: 'https://www.tikwm.com' + (res.music || res.music_info?.play)
            },
            stats: {
              views: formatNumber(res.play_count),
              likes: formatNumber(res.digg_count),
              comment: formatNumber(res.comment_count),
              share: formatNumber(res.share_count),
              download: formatNumber(res.download_count)
            },
            author: {
              nickname: res.author?.nickname,
              fullname: res.author?.unique_id,
              avatar: 'https://www.tikwm.com' + res.author?.avatar
            },
            response_time: responseTime + 'ms',
            er_license: 'Unlicense',
            from: '@er-npm/scraper'
          };

          resolve(json);
        })
        .catch(e => {
          console.log('Error in tiktokDl:', e.message);
          reject(e);
        });
    } catch (e) {
      console.log('Error in tiktokDl:', e.message);
      reject(e);
    }
  });
}

async function erai(text) {
  const ur = 'aHR0cHM6Ly9lci1hcGkuYml6LmlkL2dldC9lcmFpP3Q9';
  const ril = atob(ur);
  const ainjing = `${ril}${text}`;

  try {
    const res = await axios.get(ainjing);
    return {
      status: true,
      msg: res.data.message,
      from: `@er-npm/scraper`
    };
  } catch (err) {
    return {
      status: false,
      why: `eror anjing: ${err.message}`,
      terus_gmna: 'kunjungi t.me/er_support_group'
    };
  }
}

async function bmkg() {
  const ur = `${erUrl}/get/gempa`;
  try {
    const hasil = await axios.get(ur);
    return {
      status: true,
      res: hasil.data.hasil,
      from: '@er-npm/scraper'
    };
  } catch (er) {
    return {
      status: false,
      why: er.message,
      terus_gmna: 'kunjungi t.me/er_support_group'
    };
  }
}

async function xnxx(text) {
  const ur = `${erUrl}/dl/bkp?t=${text}`;
  try {
    const result = await axios.get(ur);
    return {
      status: 'sange',
      res: result.data.hasil,
      from: `@er-npm/scraper`
    };
  } catch (error) {
    return {
      status: 'sad',
      why: 'gabisa nntn bokep',
      terus_gmna: `tobat dulu kesini t.me/er_support_group`
    };
  }
}

const expotszz = {
  dl: require('./bkp/scrape.js'),
  ermp3: ermp3,
  ermp4: ermp4,
  ytadl: ermp3,
  ytvdl: ermp4,
  yts: yts,
  ai: ai,
  erai: erai,
  tiktokDl: tiktokDl,
  samehadakuSearch: samehadakuSearch,
  samehadakuDL: samehadakuDL,
  bmkg: bmkg,
  xnxx: xnxx,
  bokep: xnxx,
  update: updateFile
};

export default expotszz;

const {
  detectSystemInfo,
  ensureExecutable,
  handleFile,
  updateFile
} = require('./../dist/utils.js');
const { Innertube, UniversalCache } = require('youtubei.js');
const { execFile, exec } = require('child_process');
const ai = require('./ia/index.js');
const bokep = require('./bkp/scrape.js');
const path = require('path');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const er = 'aHR0cHM6Ly9lci1hcGkuYml6Lmlk';
const erUrl = atob(er);

updateFile();

const tempPath = path.join(__dirname, '../temp');
const tempDirSystem = os.tmpdir();
let PathErDL = '';

async function clearSystemTempDir() {
  try {
    const command = 'rm -rf ' + tempDirSystem + '/*';
    exec(command, err => {
      if (err) {
        console.error('Gagal membersihkan direktori sementara:', err.message);
      } else {
        console.log('✅ Direktori sementara berhasil dibersihkan.');
      }
    });
  } catch (err) {
    console.error('Kesalahan umum:', err.message);
  }
}

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
  throw new Error('❌ [ERROR] Tidak ada cookie valid yang ditemukan.');
}

async function testCookie(cookiePath) {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const args = ['--no-cache-dir', '-F', '--cookies', cookiePath, url];
  return new Promise(resolve => {
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
    console.log('📱 [PLATFORM] Sistem Android terdeteksi.');
    console.log(
      '🚀 [@er-npm/scraper] Modul diinisialisasi dengan Python untuk Android.'
    );
    return;
  }
  if (platform !== 'linux' && platform !== 'win32') {
    return console.error(
      '❌ [PLATFORM] Modul ini hanya kompatibel dengan sistem Linux, Android, dan Windows.'
    );
  }
  console.log(`✅ [PLATFORM] Sistem terdeteksi: ${platform}.`);

  switch (architecture) {
    case 'x64':
      PathErDL = path.join(
        __dirname,
        platform === 'win32' ? '../bin/ErLib_win_x64.zip' : '../bin/ErLib'
      );
      console.log('💻 [ARSITEKTUR] Arsitektur x64 terdeteksi.');
      break;
    case 'arm':
      PathErDL = path.join(__dirname, '../bin/ErLib_v7');
      console.log('🤖 [ARSITEKTUR] Arsitektur ARM terdeteksi.');
      break;
    case 'arm64':
      PathErDL = path.join(__dirname, '../bin/ErLib_64');
      console.log('🔧 [ARSITEKTUR] Arsitektur ARM64 terdeteksi.');
      break;
    case 'x86':
      PathErDL = path.join(__dirname, '../bin/ErLib_win_x86.zip');
      console.log('💻 [ARSITEKTUR] Arsitektur x86 terdeteksi.');
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

/**
 * Mendapatkan deskripsi khodam seseorang berdasarkan nama.
 * @async
 * @function khodam
 * @param {string} name - Nama seseorang yang akan dijadikan referensi untuk deskripsi khodam.
 * @returns {Promise<string>} - Deskripsi khodam dalam bahasa Indonesia dengan maksimal 2000 karakter.
 *
 * @example
 * khodam("Budi")
 *   .then((description) => console.log(description))
 *   .catch((error) => console.error(error));
 */
async function khodam(name) {
  try {
    const u = 'aHR0cHM6Ly9hcGkuYWdhdHoueHl6L2FwaS9ncHRsb2dpYw==';
    const apiUrl = atob(u);
    const prompt = encodeURIComponent(
      'Anda adalah seorang paranormal yang mampu mendeskripsikan khodam seseorang yang berupa Binatang. ' +
        'Tugas Anda adalah mendeskripsikan khodam yang mungkin ada, termasuk wujud, sifat, dan energi yang dipancarkan. ' +
        'Sehingga apapun inputnya anggap itu adalah sebuah nama seseorang. ' +
        'Deskripsi tidak harus positif bisa saja negatif tidak masalah karena ini hiburan. ' +
        'Ini hanya untuk entertainment jadi bebaskan dirimu untuk menjadi seorang paranormal pada umumnya. ' +
        'Deskripsikan Khodam dengan singkat namun jelas, dan pastikan deskripsi tidak lebih dari 2000 karakter alfabet dalam plain text serta berbahasa Indonesia.'
    );

    const response = await axios.get(apiUrl, {
      params: {
        logic: prompt,
        p: name
      }
    });

    if (response?.data[0]?.result) {
      return {
        status: true,
        res: response.data.data.result,
        from: '@er-npm/scraper'
      };
    } else {
      throw new Error('Respon API tidak valid.');
    }
  } catch (error) {
    return {
      status: false,
      why: 'eror njing.' + error.message,
      terus_gmna: 'visit: t.me/er_support_group'
    };
  }
}

/**
 * Mengunduh media dari Instagram.
 *
 * @async
 * @function igdl
 * @param {string} url - URL dari postingan Instagram yang ingin diunduh.
 * @returns {Promise<Object>} Sebuah objek yang berisi status, URL media, dan sumber, atau pesan error jika terjadi kegagalan.
 *
 * @example
 * (async () => {
 *   const result = await igdl('https://www.instagram.com/p/EXAMPLE_ID/');
 *   console.log(result);
 * })();
 */
async function igdl(url) {
  const base64Url = 'aHR0cHM6Ly9hcGkuc2lwdXR6eC5teS5pZC9hcGkvZC9pZ2RsP3VybD0=';
  const decodedUrl = atob(base64Url);
  const apiUrl = `${decodedUrl}${url}`;

  try {
    const response = await axios.get(apiUrl);
    return {
      status: true,
      url: response.data[0]?.url,
      from: '@er-npm/scraper'
    };
  } catch (error) {
    return {
      status: false,
      why: 'eror njing. ' + error.message,
      terus_gmna: 'visit: t.me/er_support_group'
    };
  }
}

/**
 * Mengambil URL audio dari video YouTube.
 *
 * Fungsi `ermp3` digunakan untuk mengambil URL audio dalam format MP3 dari video YouTube.
 * Fungsi ini membutuhkan URL video YouTube sebagai parameter dan mengembalikan objek
 * yang berisi status, judul, dan URL unduhan audio.
 *
 * @param {string} url - URL video YouTube yang akan diunduh.
 * @throws {Error} Jika terjadi kesalahan saat melakukan permintaan ke API.
 * @returns {Promise<Object>} Sebuah promise yang mengembalikan objek dengan status,
 *                            judul video, dan URL unduhan audio.
 *
 * @example
 * // Contoh penggunaan ermp3:
 * const url = "https://youtube.com/watch?v=contoh";
 * ermp3(url).then(result => console.log(result)); // Menampilkan status dan URL unduhan
 */
async function ermp3(url) {
  const base64Url = 'aHR0cHM6Ly9lci1hcGkuYml6LmlkL2RsL2VybXAzP3U9';
  const decodedUrl = atob(base64Url);
  const apiUrl = `${decodedUrl}${encodeURIComponent(url)}`;

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

/**
 * Mengambil informasi aplikasi dari Play Store berdasarkan kata kunci pencarian.
 * @param {string} query - Kata kunci pencarian aplikasi di Play Store.
 * @returns {Promise<Object>} Objek yang berisi daftar aplikasi atau pesan kesalahan.
 */
async function playstore(query) {
  const url = `https://api.siputzx.my.id/api/apk/playstore?query=${query}`;
  try {
    const res = await axios.get(url);
    const data = res.data.data;

    if (!Array.isArray(data) || data.length === 0) {
      return {
        status: false,
        why: 'Aplikasi tidak ditemukan.',
        terus_gmna: 'Kunjungi: t.me/chakszzz'
      };
    }

    return {
      status: true,
      /**
       * @property {Array<Object>} results - Daftar aplikasi yang ditemukan di Play Store.
       * @property {string} results[].nama - Nama aplikasi.
       * @property {string} results[].link - Link Play Store aplikasi.
       * @property {string} results[].thumb - URL ikon aplikasi.
       * @property {string} results[].dev - Nama pengembang aplikasi.
       * @property {string} results[].rating - Rating aplikasi.
       */
      results: data.map(app => ({
        nama: app.nama,
        link: app.link,
        thumb: app.img,
        dev: app.developer,
        rating: app.rate2
      })),
      from: '@er-npm/scraper'
    };
  } catch (error) {
    return {
      status: false,
      why: 'Terjadi kesalahan.',
      terus_gmna: 'Kunjungi: t.me/chakszzz'
    };
  }
}

/**
 * Mengunduh video dari URL YouTube yang diberikan.
 *
 * @async
 * @function ermp4
 * @param {string} url - URL video YouTube.
 * @returns {Promise<string>} Sebuah promise yang mengembalikan data hasil unduhan.
 *
 * @example
 * // Contoh penggunaan ermp4:
 * const url = "https://youtube.com/watch?v=contoh";
 * ermp4(url).then(result => console.log(result)); // Menampilkan hasil unduhan
 *
 * @author ErNewDev0 <ryppain@gmail.com>
 */

async function ermp4(url) {
  const base64Url = 'aHR0cHM6Ly9lci1hcGkuYml6LmlkL2RsL2VybXA0P3U9';
  const decodedUrl = atob(base64Url);
  const apiUrl = `${decodedUrl}${encodeURIComponent(url)}`;

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
        console.error('Kesalahan FFmpeg:', stderr || error.message);
        return reject(error);
      }
      resolve();
    });
  });
}

/**
 * Mencari video di YouTube berdasarkan query pencarian.
 *
 * @async
 * @function yts
 * @param {string} query - Kata kunci untuk mencari video di YouTube.
 * @returns {Promise<Object>} Sebuah promise yang mengembalikan hasil pencarian YouTube.
 *
 * @example
 * // Contoh penggunaan yts:
 * const query = "lofi hip hop";
 * yts(query).then(result => console.log(result)); // Menampilkan hasil pencarian
 *
 * @author ErNewDev0 <ryppain@gmail.com>
 */
async function yts(query) {
  await clearSystemTempDir();
  const yt = await Innertube.create({ cache: new UniversalCache() });
  const search = await yt.search(query);
  return search;
}

/**
 * Mencari anime di Samehadaku berdasarkan query.
 * @param {string} query - Kata kunci anime yang ingin dicari.
 * @returns {Promise<Object>} Hasil pencarian anime.
 */
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

/**
 * Mengambil link download anime dari Samehadaku.
 * @async
 * @function samehadakuDL
 * @param {string} url - URL anime dari Samehadaku.
 * @returns {Promise<Object>} Objek berisi informasi anime dan daftar link download.
 *
 * @example
 * samehadakuDL("https://samehadaku.email/rekishi-ni-nokoru-akujo-ni-naru-zo-episode-9")
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
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
      why: 'Error njing.' + error.message,
      terus_gmna: 'visit: t.me/chakszzz'
    };
  }
}

/**
 * Mengunduh video atau gambar TikTok tanpa watermark.
 * @async
 * @function tiktokDl
 * @param {string} url - URL video TikTok yang akan diunduh.
 * @returns {Promise<Object>} - Mengembalikan objek berisi detail video TikTok.
 *
 * @example
 * tiktokDl("https://www.tiktok.com/@username/video/1234567890")
 *   .then((result) => console.log(result))
 *   .catch((error) => console.error(error));
 */
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

/**
 * Melakukan fetching ke ER-API dan mendapatkan respons ERAI.
 *
 * @async
 * @function erai
 * @param {string} t - Parameter query yang akan ditambahkan ke URL API.
 * @returns {Promise<Object>} Sebuah promise yang mengembalikan objek berisi status dan pesan dari ERAI.
 * @throws {Error} Jika permintaan gagal, akan mengembalikan pesan error.
 */
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

/**
 * Mengambil informasi gempa terbaru dari BMKG.
 * @async
 * @function bmkg
 * @returns {Promise<Object>} Objek hasil dengan status, data gempa, dan sumber.
 */
async function bmkg() {
  const ur = `${erUrl}/get/gempa`;
  try {
    const hasil = await axios.get(ur);
    return {
      status: true, // Status berhasil
      res: hasil.data.hasil, // Data hasil gempa
      from: '@er-npm/scraper' // Sumber data
    };
  } catch (er) {
    return {
      status: false, // Status gagal
      why: er.message, // Pesan error
      terus_gmna: 'kunjungi t.me/er_support_group' // Saran jika error
    };
  }
}

/**
 * Mengunduh video dari situs dewasa berdasarkan query text.
 * @async
 * @function xnxx
 * @param {string} text - Kata kunci atau URL video yang ingin diunduh.
 * @returns {Promise<Object>} Objek hasil dengan status, data video, dan sumber.
 */
async function xnxx(text) {
  const ur = `${erUrl}/dl/bkp?t=${text}`;
  try {
    const result = await axios.get(ur);
    return {
      status: 'sange', // Status berhasil (dengan humor)
      res: result.data.hasil, // Data hasil unduhan
      from: '@er-npm/scraper' // Sumber data
    };
  } catch (error) {
    return {
      status: 'sad', // Status gagal
      why: 'gabisa nntn bokep', // Alasan error (dengan humor)
      terus_gmna: 'tobat dulu kesini t.me/er_support_group' // Saran jika error
    };
  }
}

module.exports = {
  ermp3,
  ermp4,
  ytadl: ermp3,
  ytvdl: ermp4,
  yts,
  playstore,
  samehadakuDL,
  samehadakuSearch,
  ai,
  update: updateFile,
  clear: clearSystemTempDir,
  tiktokDl,
  ttdl: tiktokDl,
  khodam,
  igdl,
  erai,
  xnxx,
  bokep: xnxx,
  bmkg
};

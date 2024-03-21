export const findSubArray = (arr: Uint8Array, subArr: Uint8Array) => {
  for (let i = 0; i < arr.length - subArr.length + 1; i++) {
    let found = true
    for (let j = 0; j < subArr.length; j++) {
      if (arr[i + j] !== subArr[j]) {
        found = false
        break
      }
    }
    if (found) {
      return i
    }
  }
  return -1
}

export const concatenateUint8Arrays = (a: Uint8Array, b: Uint8Array) => {
  let combined = new Uint8Array(a.length + b.length)
  combined.set(a, 0)
  combined.set(b, a.length)
  return combined
}

export const is = {
  desktop: () => typeof window !== 'undefined' && window.__TAURI__,
  macOS: () => typeof window !== 'undefined' && navigator.userAgent.includes('Mac OS X'),
  linux: () => typeof window !== 'undefined' && navigator.userAgent.includes('Linux'),
  windows: () => typeof window !== 'undefined' && navigator.userAgent.includes('Windows'),
  client: () => typeof window !== 'undefined',
  development: () => import.meta.env.DEV || import.meta.env.MODE === 'development' || process.env.NODE_ENV === 'development',
  production: () => import.meta.env.PROD || import.meta.env.MODE === 'production' || process.env.NODE_ENV === 'production',
}

export function getRandomBytes(size: number) {
  const bytes = new Uint8Array(size);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function blobToArrayBuffer(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}



export const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

export const isNodeJs = new Function("try {return this===global;}catch(e){return false;}");

export const isNextJs = typeof window !== 'undefined' && (window as any).__NEXT_DATA__;
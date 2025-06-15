// 인증번호 저장용객체

type StoreValue = {
  code: string;
  expiresAt: number;
};

const verifyStore = new Map<string, StoreValue>();

export function saveCode(phone: string, code: string) {
  verifyStore.set(phone, {
    code,
    expiresAt: Date.now() + 3 * 60 * 1000, // 3분 유효
  });
}

export function verifyCode(phone: string, inputCode: string): boolean {
  const stored = verifyStore.get(phone);
  if (!stored) return false;

  const now = Date.now();
  if (now > stored.expiresAt) {
    verifyStore.delete(phone);
    return false;
  }

  const isValid = stored.code === inputCode;
  if (isValid) verifyStore.delete(phone); // 일회용
  return isValid;
}

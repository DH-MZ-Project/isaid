interface UserUpdatePayload {
  name?: string;
  eng_name?: string;
  phone?: string;
  address?: string;
  telno?: string;
  email?: string;
  password?: string;
}

export const fetchISAInfo = async () => {
  const res = await fetch('/api/isa');

  if (res.status === 404) {
    return { error: 'NOT_FOUND' };
  }

  if (!res.ok) {
    return { error: 'UNKNOWN_ERROR', status: res.status };
  }

  return res.json();
};

export const deleteISA = async () => {
  const res = await fetch('/api/isa', {
    method: 'DELETE',
  });

  if (res.status === 404) {
    return { error: 'NOT_FOUND' };
  }

  if (!res.ok) {
    return { error: 'UNKNOWN_ERROR', status: res.status };
  }

  return res.json();
};

export const updateUser = async (payload: UserUpdatePayload) => {
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined && v !== '')
  );
  const res = await fetch('/api/user/update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanPayload),
  });

  if (!res.ok) {
    let error = {} as { message?: string };
    try {
      error = await res.json();
    } catch (e) {
      console.error('JSON 파싱 실패:', e);
      error = { message: '서버 응답을 파싱할 수 없습니다.' };
    }

    console.error('에러:', error.message);

    return { success: false, error };
  }

  const data = await res.json();
  return { success: true, data };
};

export const fetchMyInfo = async () => {
  const res = await fetch('/api/user/me');
  if (res.status === 404) {
    return { error: 'NOT_FOUND' };
  }
  if (!res.ok) {
    return { error: 'UNKNOWN_ERROR' };
  }
  return res.json();
};

export const leaveUser = async (password: string) => {
  const res = await fetch('/api/user/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '탈퇴 요청 실패');
  }

  return res.json();
};

export const verifyPin = async (pin: string) => {
  const data = { pinCode: pin };
  const res = await fetch('/api/user/verify-pin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '탈퇴 요청 실패');
  }

  return res.json();
};

export const verifyPassword = async (password: string) => {
  const data = { password };
  const res = await fetch('/api/user/비번-인증', { method: 'GET' });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '수정 에러');
  }
};

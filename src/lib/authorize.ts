// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function authorize(token: any, roles: string[]) {
  if (!token || !roles.includes(token.role)) {
    throw new Error('FORBIDDEN');
  }
}

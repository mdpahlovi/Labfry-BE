export function GenerateCode(length: number = 6) {
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += char.charAt(Math.floor(Math.random() * char.length));
    }
    return code;
}

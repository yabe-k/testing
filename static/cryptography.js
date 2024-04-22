class Cryptography {
    static char1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    static char2 = "zp2SQbwZOlUMDhAuHqtLRi4NJryWfc16eIKBCaGdT9mg83nEVjPvoYxs75X0Fk";

    static encode(text) {
        return Cryptography._convert(text, Cryptography.char1, Cryptography.char2);
    }

    static decode(text) {
        return Cryptography._convert(text, Cryptography.char2, Cryptography.char1);
    }

    static _convert(text, char_a, char_b) {
        let output = "";
        for (let letter of text) {
            if (char_a.includes(letter)) {
                output += char_b[char_a.indexOf(letter)];
            } else {
                output += letter;
            }
        }
        return output;
    }
}
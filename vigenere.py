import re

def encrypt(ptext: str, key: str) -> str:
    base = ord("A")

    ptext = re.sub("[^a-zA-Z]", "", ptext).upper()
    key = re.sub("[^a-zA-Z]", "", key).upper()

    if (ptext == "" or key == ""):
        return ""

    ctext = ""

    for i in range(len(ptext)):
        pi = ord(ptext[i]) - base
        ki = ord(key[i % len(key)]) - base
        ci = ((pi + ki) % 26) + base
        ctext += chr(ci)

    return ctext


def decrypt(ctext: str, key: str) -> str:
    base = ord("A")

    ctext = re.sub("[^a-zA-Z]", "", ctext).upper()
    key = re.sub("[^a-zA-Z]", "", key).upper()

    if (ctext == "" or key == ""):
        return ""

    ptext = ""

    for i in range(len(ctext)):
        ci = ord(ctext[i]) - base
        ki = ord(key[i % len(key)]) - base
        pi = ((ci - ki + 26) % 26) + base
        ptext += chr(pi)

    return ptext


if __name__ == "__main__":
    key = 'test'
    text = "hello world"
    print(encrypt(text, key))
    print(decrypt(encrypt(text, key), key))
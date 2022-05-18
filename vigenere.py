import re
from collections import Counter
from itertools import combinations, product


def __get_factors(x: int):
    for i in range(2, (x // 2) + 1):
        if x % i == 0:
            yield i
    yield x


def __normalize(text):
    return re.sub("[^a-zA-Z]", "", text).upper()


def encrypt(ptext: str, key: str) -> str:
    base = ord("A")

    ptext = __normalize(ptext)
    key = __normalize(key)

    if ptext == "" or key == "":
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

    ctext = __normalize(ctext)
    key = __normalize(key)

    if ctext == "" or key == "":
        return ""

    ptext = ""

    for i in range(len(ctext)):
        ci = ord(ctext[i]) - base
        ki = ord(key[i % len(key)]) - base
        pi = ((ci - ki + 26) % 26) + base
        ptext += chr(pi)

    return ptext


# http://en.wikipedia.org/wiki/Letter_frequency
ENGLISH_LETTER_FREQ = {
    'E': 12.70,
    'T': 9.06,
    'A': 8.17,
    'O': 7.51,
    'I': 6.97,
    'N': 6.75,
    'S': 6.33,
    'H': 6.09,
    'R': 5.99,
    'D': 4.25,
    'L': 4.03,
    'C': 2.78,
    'U': 2.76,
    'M': 2.41,
    'W': 2.36,
    'F': 2.23,
    'G': 2.02,
    'Y': 1.97,
    'P': 1.93,
    'B': 1.29,
    'V': 0.98,
    'K': 0.77,
    'J': 0.15,
    'X': 0.15,
    'Q': 0.10,
    'Z': 0.07,
}


def kasiski_examination(ctext, sequence_len=3):
    """
    Kasiski Examination: https://en.wikipedia.org/wiki/Kasiski_examination
    first, find every repeated set of letters at least three letters long
    in the ciphertext and then get Factors of Spacings and count them.
    """

    ctext = __normalize(ctext)

    # key is sequence and value is a list of all start index of sequence in
    # cipher text
    sequences_dict = {}

    # find all sub sequences with at least three letters
    for index in range(len(ctext) - sequence_len + 1):
        current_sequence = ctext[index : index + sequence_len]
        if sequences_dict.get(current_sequence):
            sequences_dict.get(current_sequence).append(index)
        else:
            sequences_dict[current_sequence] = [index]

    factor_dict = {}
    # calculate spacing between repeat sequences
    for seq in list(sequences_dict.keys()):
        if len(sequences_dict[seq]) == 1:
            # we don't need sequences without any repetition
            del sequences_dict[seq]
        else:
            for comb in combinations(sequences_dict[seq], 2):
                current_spacing = abs(comb[0] - comb[1])
                for f in __get_factors(current_spacing):
                    factor_dict[f] = factor_dict.get(f, 0) + 1
    return sorted(factor_dict.items(), key=lambda x: x[1], reverse=True)


def key_detection(ctext, key_len):
    ctext = __normalize(ctext)

    # get Every key_len'th letter starting with the i letter. they are
    # encoded with same char & it's Caesar cipher
    key_chars_candidate = []
    for i in range(key_len):
        score_dict = frequency_analysis(ctext[i::key_len])
        sorted_scores = sorted(score_dict.items(), key=lambda x: x[1], reverse=True)
        max_score = sorted_scores[0][1]
        candids = []
        for i, s in sorted_scores:
            if s >= (max_score - (max_score * 20 / 100)):
                candids.append(i)
            else:
                break
        key_chars_candidate.append(candids)

    return list(product(*key_chars_candidate))


def frequency_analysis(ctext):
    ctext = __normalize(ctext)

    char_freq = Counter(ctext)
    score_dict = {}
    for key in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        score_dict[key] = 0
        for c in char_freq:
            score_dict[key] += (
                char_freq[c] * 100 / len(ctext) * ENGLISH_LETTER_FREQ[chr((ord(c) - ord(key)) % 26 + ord('A'))]
            )

    return score_dict

function k_combinations(set, k) {
    /**
     * Copyright 2012 Akseli Palén.
     * Created 2012-07-15.
     * Licensed under the MIT license.
    **/

    var i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
        return [];
    }

    if (k == set.length) {
        return [set];
    }

    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {

        head = set.slice(i, i + 1);

        tailcombs = k_combinations(set.slice(i + 1), k - 1);

        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

function* get_factors(x) {
    for (let i = 2; i < Math.floor(x / 2) + 1; i++) {
        if (x % i === 0) {
            yield i;
        }
    }
    yield x;
}

function stepSplitStr(str, start, step) {
    var res = "";
    for (var i = start; i < str.length; i += step) {
        res = res.concat(str.charAt(i));
    }
    return res;
}

function encrypt(ptext, key) {
    const base = "A".charCodeAt(0);

    ptext = ptext.replace(/[^a-zA-Z]/g, "").toUpperCase();
    key = key.replace(/[^a-zA-Z]/g, "").toUpperCase();

    if (ptext === "" || key === "") {
        return "";
    }

    var ctext = "";

    for (let i = 0; i < ptext.length; i++) {
        var pi = ptext.charCodeAt(i) - base;
        var ki = key.charCodeAt(i % key.length) - base;
        var ci = ((pi + ki) % 26) + base;
        ctext = ctext.concat(String.fromCharCode(ci));
    }

    return ctext;
}

function decrypt(ctext, key) {
    const base = "A".charCodeAt(0);

    ctext = ctext.replace(/[^a-zA-Z]/g, "").toUpperCase();
    key = key.replace(/[^a-zA-Z]/g, "").toUpperCase();

    if (ctext === "" || key === "") {
        return "";
    }

    var ptext = "";

    for (let i = 0; i < ctext.length; i++) {
        var ci = ctext.charCodeAt(i) - base;
        var ki = key.charCodeAt(i % key.length) - base;
        var pi = ((ci - ki + 26) % 26) + base;
        ptext = ptext.concat(String.fromCharCode(pi));
    }

    return ptext;
}

function kasiskiExamination(ctext, sequence_len = 3) {
    ctext = ctext.replace(/[^a-zA-Z]/g, "").toUpperCase();

    if (ctext === "") {
        return {};
    }

    var sequences_dict = {};
    var factor_dict = {};

    for (let index = 0; index < ctext.length - sequence_len + 1; index++) {
        var current_sequence = ctext.slice(index, index + sequence_len);
        if (sequences_dict.hasOwnProperty(current_sequence)) {
            sequences_dict[current_sequence].push(index);
        } else {
            sequences_dict[current_sequence] = [index];
        }
    }

    for (const seq in sequences_dict) {
        if (sequences_dict[seq].length === 1) {
            delete sequences_dict[seq];
        } else {
            for (const comb of k_combinations(sequences_dict[seq], 2)) {
                var current_spacing = Math.abs(comb[0] - comb[1]);
                for (const f of get_factors(current_spacing)) {
                    var factor_count = factor_dict[f] || 0;
                    factor_dict[f] = factor_count + 1;
                }
            }
        }
    }

    return factor_dict;
}

// http://en.wikipedia.org/wiki/Letter_frequency
const ENGLISH_LETTER_FREQ = {
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

function frequency_analysis(ctext) {
    ctext = ctext.replace(/[^a-zA-Z]/g, "").toUpperCase();

    var char_freq = {};
    ctext.split('').forEach(val => char_freq[val] = (char_freq[val] || 0) + 1);

    var score_dict = {};
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < chars.length; i++) {
        var key = chars.charAt(i);
        score_dict[key] = 0;
        for (const c in char_freq) {
            var char_diff = c.charCodeAt(0) - key.charCodeAt(0);
            if (char_diff >= 0) {
                var lettr = char_diff % 26;
            } else {
                var lettr = 26 - (Math.abs(char_diff) % 26);
            }
            Math.abs() % 26;

            score_dict[key] += (
                char_freq[c] * 100 / ctext.length * ENGLISH_LETTER_FREQ[String.fromCharCode(lettr + 'A'.charCodeAt(0))]
            );
        }
    }

    return score_dict;
}

function keyDetection(ctext, key_len) {
    ctext = ctext.replace(/[^a-zA-Z]/g, "").toUpperCase();

    key_chars_candidate = []
    for (var i = 0; i < key_len; i++) {
        var sub_ctext = stepSplitStr(ctext, i, key_len);
        var score_dict = frequency_analysis(sub_ctext);
        var sorted_scores = [];
        for (var z in score_dict) {
            sorted_scores.push([z, score_dict[z]]);
        }
        sorted_scores.sort(function (a, b) {
            return b[1] - a[1];
        });
        var max_score = sorted_scores[0][1];
        var candids = [];
        for (var j = 0; j < sorted_scores.length; j++) {
            if (sorted_scores[j][1] >= (max_score - (max_score * 20 / 100))) {
                candids.push(sorted_scores[j][0]);
            }
            else {
                break;
            }
        }
        key_chars_candidate.push(candids);
    }

    return key_chars_candidate;
}
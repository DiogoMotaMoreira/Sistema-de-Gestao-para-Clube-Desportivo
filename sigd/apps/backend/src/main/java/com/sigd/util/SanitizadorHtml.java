package com.sigd.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class SanitizadorHtml {
    public static String sanitizar(String input) {
        if (input == null) return null;
        return Jsoup.clean(input, Safelist.none());
    }
}

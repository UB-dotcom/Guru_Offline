package com.guruoffline.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val PrimaryBlue = Color(0xFF2563EB)
val PrimaryDark = Color(0xFF1D4ED8)
val EmeraldGreen = Color(0xFF059669)
val SurfaceLight = Color(0xFFFFFFFF)
val BackgroundLight = Color(0xFFF8FAFC)
val TextDark = Color(0xFF0F172A)
val TextMuted = Color(0xFF64748B)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    secondary = EmeraldGreen,
    background = BackgroundLight,
    surface = SurfaceLight,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = TextDark,
    onSurface = TextDark
)

@Composable
fun GuruOfflineTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}

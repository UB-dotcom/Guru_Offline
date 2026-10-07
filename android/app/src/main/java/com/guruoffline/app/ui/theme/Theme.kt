package com.guruoffline.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Modern Violet / Lumina AI Palette
val PrimaryPurple = Color(0xFF7C5CFC)
val PrimaryDark = Color(0xFF6734E8)
val PrimaryLight = Color(0xFF9B7EFC)
val PrimarySurface = Color(0xFFF0EDFF)
val AccentLilac = Color(0xFFEDE7FF)
val FlameStreak = Color(0xFFFF7A45)
val XpPurple = Color(0xFF8B5CF6)
val CyanAccent = Color(0xFF00D2D3)

val SurfaceLight = Color(0xFFFFFFFF)
val BackgroundLight = Color(0xFFF6F5FB)
val SoftBorder = Color(0xFFEDE9FE)
val TextDark = Color(0xFF1E1B4B)
val TextMuted = Color(0xFF79768F)

// Backwards-compatible aliases for existing screen references
val PrimaryBlue = PrimaryPurple
val EmeraldGreen = Color(0xFF10B981)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryPurple,
    secondary = PrimaryLight,
    tertiary = FlameStreak,
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


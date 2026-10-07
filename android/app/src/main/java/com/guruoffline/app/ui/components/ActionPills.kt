package com.guruoffline.app.ui.components

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun ActionPillsRow(
    language: String = "en",
    onActionClick: (String) -> Unit
) {
    val isHindi = language.lowercase() == "hi"

    val actions = if (isHindi) {
        listOf(
            Pair("Explain More Simply", "और सरल समझाएं"),
            Pair("Give Another Example", "अन्य उदाहरण दें"),
            Pair("Practice", "अभ्यास"),
            Pair("Quiz", "क्विज़"),
            Pair("Ask Follow-up", "अगला प्रश्न पूछें")
        )
    } else {
        listOf(
            Pair("Explain More Simply", "Explain More Simply"),
            Pair("Give Another Example", "Give Another Example"),
            Pair("Practice", "Practice"),
            Pair("Quiz", "Quiz"),
            Pair("Ask Follow-up", "Ask Follow-up")
        )
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        actions.forEach { (actionKey, actionLabel) ->
            OutlinedButton(
                onClick = { onActionClick(actionKey) },
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = PrimaryBlue
                ),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = actionLabel,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

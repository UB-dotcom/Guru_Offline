# ProGuard rules for Guru Offline
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class com.guruoffline.app.model.** { *; }

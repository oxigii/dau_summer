plugins {
    alias(libs.plugins.kotlin.jvm)
    id("java-gradle-plugin")
}

repositories {
    google()
    mavenCentral()
}

gradlePlugin {
    plugins {
        create("react") {
            id = "com.facebook.react"
            implementationClass = "com.facebook.react.ReactPlugin"
        }
        create("reactrootproject") {
            id = "com.facebook.react.rootproject"
            implementationClass = "com.facebook.react.ReactRootProjectPlugin"
        }
    }
}

group = "com.facebook.react"

dependencies {
    implementation(project(":shared"))
    implementation(gradleApi())
    implementation(libs.kotlin.gradle.plugin)
    implementation(libs.android.gradle.plugin)
    implementation(libs.gson)
    implementation(libs.guava)
    implementation(libs.javapoet)

    testImplementation(libs.junit)
    testImplementation(libs.assertj)
    testImplementation(project(":shared-testutil"))
}

java { 
    targetCompatibility = JavaVersion.VERSION_11 
}

kotlin { 
    jvmToolchain(11)  // JDK 11 설정
}

tasks.withType<KotlinCompile>().configureEach {
    compilerOptions {
        apiVersion.set(KotlinVersion.KOTLIN_1_8)  // Kotlin 1.8 버전 설정
        jvmTarget.set(JvmTarget.JVM_11)  // JDK 11 타겟 설정

        // 경고를 오류로 처리하는 설정
        val allWarningsAsErrors = project.properties["enableWarningsAsErrors"]?.toString()?.toBoolean() ?: false
        allWarningsAsErrors.set(allWarningsAsErrors)  // Property<Boolean>로 설정
    }
}

tasks.withType<Test>().configureEach {
    testLogging {
        exceptionFormat = TestExceptionFormat.FULL  // 예외를 상세히 출력
        showExceptions = true
        showCauses = true
        showStackTraces = true
    }
}

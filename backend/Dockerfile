# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app

# 1. Copy only the pom.xml to download dependencies (improves caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final lightweight runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=build /app/target/Buy-Baazar-0.0.1-SNAPSHOT.jar app.jar

# Standard Spring Boot port
EXPOSE 8080

# Run with optimized JVM settings for containers
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
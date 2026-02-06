# Stage 1: Build Stage
# Uses Maven with Java 21 to compile the code
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy pom.xml and download dependencies (for faster builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Stage
# Uses a lightweight JRE for the final production image
FROM eclipse-temurin:21-jre
WORKDIR /app

# 3. Copy the built JAR from the build stage
# Ensure the name matches your artifactId in pom.xml
COPY --from=build /app/target/Buy-Baazar-0.0.1-SNAPSHOT.jar app.jar

# 4. Expose the port (matches your pattern)
EXPOSE 8080

# 5. Run the application with the 'prod' profile active by default
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
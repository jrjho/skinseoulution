# working
FROM openjdk:19

# Set the working directory
WORKDIR /app

# Copy the application JAR file from the server/target directory
COPY target/server-0.0.1-SNAPSHOT.jar .

# Expose the port that the Spring Boot application listens on
EXPOSE 8080

# Set the startup command
CMD ["java", "-jar", "server-0.0.1-SNAPSHOT.jar"]



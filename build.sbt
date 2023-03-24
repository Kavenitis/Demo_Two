ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.13.10"

lazy val root = (project in file("."))
  .settings(
    name := "Demo 2"
  )
// https://mvnrepository.com/artifact/org.scalafx/scalafx
libraryDependencies += "org.scalafx" %% "scalafx" % "19.0.0-R30"

libraryDependencies += "org.json4s" %% "json4s-native" % "4.0.3"

// https://mvnrepository.com/artifact/com.typesafe.akka/akka-actor
libraryDependencies += "com.typesafe.akka" %% "akka-actor" % "2.8.0"
// https://mvnrepository.com/artifact/com.typesafe.play/play-json
libraryDependencies += "com.typesafe.play" %% "play-json" % "2.10.0-RC1"

// https://mvnrepository.com/artifact/org.scalafx/scalafx
libraryDependencies += "org.scalafx" %% "scalafx" % "15.0.1-R21"

// https://mvnrepository.com/artifact/org.openjfx/javafx-controls
libraryDependencies += "org.openjfx" % "javafx-controls" % "15.0.1"

// https://mvnrepository.com/artifact/org.openjfx/javafx-media
libraryDependencies += "org.openjfx" % "javafx-media" % "15.0.1"

// https://mvnrepository.com/artifact/org.scalaj/scalaj-http
libraryDependencies += "org.scalaj" %% "scalaj-http" % "2.4.2"

// https://mvnrepository.com/artifact/com.typesafe.akka/akka-actor
libraryDependencies += "com.typesafe.akka" %% "akka-actor" % "2.6.13"

// https://mvnrepository.com/artifact/mysql/mysql-connector-java
libraryDependencies += "mysql" % "mysql-connector-java" % "8.0.23"

// https://mvnrepository.com/artifact/io.socket/socket.io-client
libraryDependencies += "io.socket" % "socket.io-client" % "1.0.0"

// https://mvnrepository.com/artifact/com.corundumstudio.socketio/netty-socketio
libraryDependencies += "com.corundumstudio.socketio" % "netty-socketio" % "1.7.12"

// https://mvnrepository.com/artifact/org.apache.maven/maven-model
libraryDependencies += "org.apache.maven" % "maven-model" % "3.9.1"
// https://mvnrepository.com/artifact/org.openrdf.sesame/sesame-model
libraryDependencies += "org.openrdf.sesame" % "sesame-model" % "4.1.2"















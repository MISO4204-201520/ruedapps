name := """ruedapp"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .enablePlugins(PlayJava, PlayEbean)
scalaVersion := "2.11.6"

resolvers += Resolver.sonatypeRepo("snapshots")

libraryDependencies ++= Seq(
  javaJdbc,
  cache,
  javaWs,
  jdbc,
  javaJpa,
  "org.xerial" % "sqlite-jdbc" % "3.8.9",
  "com.feth"      %% "play-authenticate" % "0.7.0"
)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator
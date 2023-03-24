package Controller

import Model.{AddParty, AnimateAction, BattleEnded, BattleStarted, BattleState, BattleSystem, CharacterTurnReady, RemoveParty, TurnAction, Update}
import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import com.corundumstudio.socketio.{AckRequest, SocketIOClient, SocketIOServer}
import java.lang.module.Configuration
import play.api.libs.json.Json


class BattleTestServer() extends Actor {

  val battleSystem: ActorRef = this.context.actorOf(Props(classOf[BattleSystem], self))
  var id: Int = 1

  var socketToPartyId: Map[SocketIOClient, String] = Map()
  var partyIdToSocket: Map[String, SocketIOClient] = Map()

  val config: Configuration = new Configuration {
    setHostname("localhost")
    setPort(8080)
  }

  val server: SocketIOServer = new SocketIOServer(config)

  server.addConnectListener(
    (socket: SocketIOClient) => {
      val partyId = "party_" + id.toString
      id += 1
      socket.sendEvent("yourPartyId", partyId)
      socketToPartyId += socket -> partyId
      partyIdToSocket += partyId -> socket
      battleSystem ! AddParty(partyId, partyJSON(partyId))
    }
  )

  server.addDisconnectListener(
    (socket: SocketIOClient) => {
      battleSystem ! RemoveParty(socketToPartyId(socket))
      partyIdToSocket -= socketToPartyId(socket)
      socketToPartyId -= socket
      println(socket, " disconnected")
    }
  )


  server.addEventListener("battleAction", classOf[String],
    (socket: SocketIOClient, data: String, _: AckRequest) => {
      val partyId = socketToPartyId(socket)
      val dataParsed = Json.parse(data)
      val action = (dataParsed \ "action").as[String]
      val sourceName = (dataParsed \ "source").as[String]
      val targetName = (dataParsed \ "target").as[String]
      //      println(sourceName, action, targetName)
      battleSystem ! TurnAction(partyId, sourceName, targetName, action)
    }
  )

  server.addEventListener("startBattle", classOf[String],
    (socket: SocketIOClient, data: String, _: AckRequest) => {
      val partyId = socketToPartyId(socket)
      val targetPartyId = data
      println("fight!", partyId, " with ", targetPartyId)
      battleSystem ! BattleStarted(partyId, targetPartyId)
    }
  )

  server.start()

  override def postStop(): Unit = {
    println("stopping server")
    server.stop()
  }


  override def receive: Receive = {

    case update: Update =>
      server.getBroadcastOperations.sendEvent("allParties", Json.stringify(Json.toJson(partyIdToSocket.keys)))
      battleSystem ! update

    case battleEnd: BattleEnded =>
      partyIdToSocket(battleEnd.losingPartyId).sendEvent("battleEnded", battleEnd.winningPartyId)
      partyIdToSocket(battleEnd.winningPartyId).sendEvent("battleEnded", battleEnd.winningPartyId)
    case battleState: BattleState =>
      partyIdToSocket(battleState.partyId1).sendEvent("battleState", Json.stringify(Json.toJson(
        Map("playerParty" -> battleState.partyJSON1, "enemyParty" -> battleState.partyJSON2)
      )))
      partyIdToSocket(battleState.partyId2).sendEvent("battleState", Json.stringify(Json.toJson(
        Map("playerParty" -> battleState.partyJSON2, "enemyParty" -> battleState.partyJSON1)
      )))
    case turnReady: CharacterTurnReady =>
      partyIdToSocket(turnReady.partyId).sendEvent("turnReady", turnReady.characterName)
    case action: AnimateAction =>
      val message = Json.stringify(Json.toJson(Map(
        "source" -> Json.toJson(action.sourceName),
        "target" -> Json.toJson(action.targetName),
        "deltaHP" -> Json.toJson(action.deltaHP)
      )))
      partyIdToSocket(action.sourcePartyId).sendEvent("actionTaken", message)
      partyIdToSocket(action.targetPartyId).sendEvent("actionTaken", message)

  }


  def partyJSON(name: String): String = {
    val characters = Json.toJson(List(
      Json.toJson(Map(
        "name" -> Json.toJson("Bruiser_1_" + name),
        "type" -> Json.toJson("bruiser"),
        "lvl" -> Json.toJson(15),
        "curHP" -> Json.toJson(100),
        "curMP" -> Json.toJson(0),
        "alive" -> Json.toJson(true),
        "maxHP" -> Json.toJson(100),
        "maxMP" -> Json.toJson(0),
        "def" -> Json.toJson(5),
        "magDef" -> Json.toJson(5),
        "lvlUpExp" -> Json.toJson(100),
        "AD" -> Json.toJson(60),
        "AP" -> Json.toJson(0),
        "Exp" -> Json.toJson(0)
      )),
      Json.toJson(Map(
        "name" -> Json.toJson("Bruiser_2_" + ID),
        "type" -> Json.toJson("bruiser"),
        "lvl" -> Json.toJson(15),
        "curHP" -> Json.toJson(100),
        "curMP" -> Json.toJson(0),
        "alive" -> Json.toJson(true),
        "maxHP" -> Json.toJson(100),
        "maxMP" -> Json.toJson(0),
        "def" -> Json.toJson(5),
        "magDef" -> Json.toJson(5),
        "lvlUpExp" -> Json.toJson(100),
        "AD" -> Json.toJson(60),
        "AP" -> Json.toJson(0),
        "Exp" -> Json.toJson(0)
      )),
      Json.toJson(Map(
        "name" -> Json.toJson("Bruiser_3_" + ID),
        "type" -> Json.toJson("bruiser"),
        "lvl" -> Json.toJson(15),
        "curHP" -> Json.toJson(100),
        "curMP" -> Json.toJson(0),
        "alive" -> Json.toJson(true),
        "maxHP" -> Json.toJson(100),
        "maxMP" -> Json.toJson(0),
        "def" -> Json.toJson(5),
        "magDef" -> Json.toJson(5),
        "lvlUpExp" -> Json.toJson(100),
        "AD" -> Json.toJson(60),
        "AP" -> Json.toJson(0),
        "Exp" -> Json.toJson(0)
      )),
      Json.toJson(Map(
        "name" -> Json.toJson("Bruiser_4_" + ID),
        "type" -> Json.toJson("bruiser"),
        "lvl" -> Json.toJson(15),
        "curHP" -> Json.toJson(100),
        "curMP" -> Json.toJson(0),
        "alive" -> Json.toJson(true),
        "maxHP" -> Json.toJson(100),
        "maxMP" -> Json.toJson(0),
        "def" -> Json.toJson(5),
        "magDef" -> Json.toJson(5),
        "lvlUpExp" -> Json.toJson(100),
        "AD" -> Json.toJson(60),
        "AP" -> Json.toJson(0),
        "Exp" -> Json.toJson(0)
      )),
    ))
    val JSONMap = Json.stringify(characters)
    //    println(JSONMap)
    JSONMap
  }

}


object BattleTestServer {

  def main(args: Array[String]): Unit = {
    val actorSystem = ActorSystem()

    import actorSystem.dispatcher

    import scala.concurrent.duration._

    val server = actorSystem.actorOf(Props(classOf[BattleTestServer]))

    actorSystem.scheduler.schedule(0.milliseconds, 33.milliseconds, server, Update(System.nanoTime()))
  }
}
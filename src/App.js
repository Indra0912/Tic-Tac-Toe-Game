import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Snackbar from "react-native-snackbar";
import Icons from "./componets/Icons";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";


function App() {
  const [isCross, setIsCross] = useState(false);
  const [gameWinner, setGameWinner] = useState("");
  const [gameState, setGameState] = useState(new Array(9).fill("empty"));
  const [winningCombo, setWinningCombo] = useState(null);


  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };


  const reloadGame = () => {
    setIsCross(false);
    setGameWinner("");
    setGameState(new Array(9).fill("empty"));
    setWinningCombo(null);
    ReactNativeHapticFeedback.trigger("impactLight", options);
  };


  const checkIsWinner = (board) => {
    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];


    for (let combo of combos) {
      const [a, b, c] = combo;
      if (
        board[a] !== "empty" &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        setGameWinner(`${board[a]} Won the game!`);
        setWinningCombo(combo);
        return;
      }
    }


    if (!board.includes("empty")) {
      setGameWinner("Draw Game");
      setWinningCombo(null);
    }
  };


  const getLineStyle = () => {
    if (!winningCombo) return null;


    const key = winningCombo.join(",");


    // Rows (horizontal)
    if (key === "0,1,2") return { type: "row", top: "16.6%" };
    if (key === "3,4,5") return { type: "row", top: "50%" };
    if (key === "6,7,8") return { type: "row", top: "83.3%" };


    // Columns (vertical)
    if (key === "0,3,6") return { type: "col", left: "16.6%" };
    if (key === "1,4,7") return { type: "col", left: "50%" };
    if (key === "2,5,8") return { type: "col", left: "83.3%" };


    // Diagonals (rotated horizontal line)
    if (key === "0,4,8") return { type: "diag", rotate: "45deg" };
    if (key === "2,4,6") return { type: "diag", rotate: "-45deg" };


    return null;
  };


  const lineStyle = getLineStyle();


  const onChangeItem = (index) => {
    if (gameWinner) {
      return Snackbar.show({
        text: gameWinner,
        backgroundColor: "#000000",
        textColor: "#ffffff",
      });
    }


    if (gameState[index] !== "empty") {
      return Snackbar.show({
        text: "Position is Already Filled",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      });
    }


    const newGameState = [...gameState];
    newGameState[index] = isCross ? "cross" : "circle";


    setGameState(newGameState);
    setIsCross((prev) => !prev);


    checkIsWinner(newGameState);
    ReactNativeHapticFeedback.trigger("impactLight", options);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="transparent" />


      <View style={styles.playerInfo}>
        {gameWinner ? (
          <Text style={styles.winnerTxt}>{gameWinner}</Text>
        ) : (
          <Text
            style={[
              styles.gameTurnTxt,
              isCross ? styles.gameTurnTxt1 : styles.gameTurnTxt2,
            ]}
          >
            Player {isCross ? "X" : "O"}'s Turn
          </Text>
        )}
      </View>


      <View style={styles.boardWrap}>
        <FlatList
          numColumns={3}
          data={gameState}
          scrollEnabled={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              style={[styles.card, gameWinner && styles.cardDisabled]}
              disabled={!!gameWinner}
              onPress={() => onChangeItem(index)}
            >
              <Icons name={item} />
            </Pressable>
          )}
        />


        {/* ✅ Winning line (fixed for columns) */}
        {lineStyle?.type === "row" && (
          <View
            pointerEvents="none"
            style={[styles.winLineRow, { top: lineStyle.top }]}
          />
        )}


        {lineStyle?.type === "col" && (
          <View
            pointerEvents="none"
            style={[styles.winLineCol, { left: lineStyle.left }]}
          />
        )}


        {lineStyle?.type === "diag" && (
          <View
            pointerEvents="none"
            style={[
              styles.winLineDiag,
              { transform: [{ rotate: lineStyle.rotate }] },
            ]}
          />
        )}
      </View>


      {/* Game Button */}
      <Pressable style={styles.gameBtn} onPress={reloadGame}>
        <Text style={styles.gameButtonTxt}>
          {gameWinner ? "Start a new game" : "Reload"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { backgroundColor: "#111111", flex: 1 },


  playerInfo: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 14,
    marginVertical: 20,
  },


  winnerTxt: {
    fontSize: 26,
    color: "#38CC77",
    fontWeight: "600",
    textTransform: "capitalize",
  },


  gameTurnTxt: { fontSize: 26, fontWeight: "600" },
  gameTurnTxt1: { color: "#F87171" },
  gameTurnTxt2: { color: "#60A5FA" },


  boardWrap: {
    marginHorizontal: 15,
    aspectRatio: 1,
    position: "relative",
  },


  card: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4a261",
  },


  cardDisabled: { opacity: 0.7 },


  // ✅ Row line
  winLineRow: {
    position: "absolute",
    left: "5%",
    width: "90%",
    height: 4,
    backgroundColor: "#38CC77",
    borderRadius: 6,
  },


  // ✅ Column line
  winLineCol: {
    position: "absolute",
    top: "5%",
    height: "90%",
    width: 4,
    backgroundColor: "#38CC77",
    borderRadius: 6,
  },


  // ✅ Diagonal line
  winLineDiag: {
    position: "absolute",
    top: "50%",
    left: "5%",
    width: "90%",
    height: 4,
    backgroundColor: "#38CC77",
    borderRadius: 6,
  },


  gameBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "center",
    minWidth: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#86baa1",
    borderRadius: 20,
    marginTop: 60,
    marginBottom: 30,
  },


  gameButtonTxt: { color: "#ffffff", fontWeight: "600" },
});


export default App;
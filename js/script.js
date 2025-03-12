$(document).ready(function () {
    var board,
        game = new Chess();

    function makeRandomMove() {
        var possibleMoves = game.moves();
        if (game.game_over() || possibleMoves.length === 0) {
            $("#status").text("Partie terminée !");
            return;
        }

        var randomIdx = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIdx]);
        board.position(game.fen());

        if (game.game_over()) {
            $("#status").text("L'IA a gagné !");
        }
    }

    var config = {
        draggable: true,
        position: "start",
        onDrop: function (source, target) {
            var move = game.move({ from: source, to: target, promotion: "q" });

            if (move === null) return "snapback"; // Coup invalide

            setTimeout(makeRandomMove, 250);
        }
    };

    board = Chessboard("board", config);
});

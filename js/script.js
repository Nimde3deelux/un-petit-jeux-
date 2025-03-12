const game = new Chess();
const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: (source, target) => {
        const move = game.move({ from: source, to: target, promotion: 'q' });
        if (move === null) return 'snapback';
        updateStatus();
    }
});

function updateStatus() {
    document.getElementById('status').textContent = game.turn() === 'w' 
        ? "C'est aux blancs de jouer" 
        : "C'est aux noirs de jouer";
}

document.getElementById('restart').addEventListener('click', () => {
    game.reset();
    board.position('start');
    updateStatus();
});

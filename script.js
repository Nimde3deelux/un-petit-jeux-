const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: (source, target, piece) => {
        console.log(`Pièce déplacée de ${source} à ${target}`);
    }
});

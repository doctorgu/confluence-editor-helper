/*
--summary
선택 셀의 네 모서리 위치 정보를 리턴함
--example
// 시작 행: 5, 종료 행: 6, 시작 열: 5, 종료 열: 5인 경우
getSelectedRegion()
// 결과: {row1: 4, row2: 5, col1: 4, col2: 4}
*/
function getSelectedRegion() {
  let row1 = 999999,
    row2 = -1,
    col1 = 999999,
    col2 = -1;
  iterateSelected((td, i, row, col) => {
    if (row < row1) row1 = row;
    if (row > row2) row2 = row;

    if (col < col1) col1 = col;
    if (col > col2) col2 = col;
  });

  if (row2 === -1) return null;

  return { row1, row2, col1, col2 };
}

/*
--summary
선택된 각 셀에 대해 callbackFn 함수를 호출
--example
// 모든 선택 셀의 정보를 출력
iterateSelected((td, i, rw, cl) => console.log(`td.innerHTML:${td.innerHTML}, i:${i}, rw:${rw}, cl:${cl}`))
*/
function iterateSelected(callbackFn) {
  const list = [
    ...document.querySelectorAll(
      "th[data-mce-selected='1'],td[data-mce-selected='1']"
    ),
  ];
  list.forEach((td, i) =>
    callbackFn(td, i, td.parentElement.rowIndex, td.cellIndex)
  );
}

// -------------------------------------------------------------

/*
--summary
내용 삭제
*/
function empty() {
  const list = [...document.querySelectorAll("td[data-mce-selected='1']")];
  list.forEach((td, i) => (td.innerText = ``));
}

/*
--summary
선택 셀을 확장
--example
// 현재 셀의 정보가 {row1: 4, row2: 5, col1: 4, col2: 4}일 때 1만큼 오른쪽으로 확장
extendSelection(1, 'right')
// 결과: {row1: 4, row2: 5, col1: 5, col2: 5} 
*/
function extendSelection(count, direction) {
  const list = [...document.querySelectorAll("td[data-mce-selected='1']")];

  const selected = getSelectedRegion();

  let selectedNew = {};
  switch (direction) {
    case "down":
      selectedNew = {
        row1: selected.row2 + 1,
        row2: selected.row2 + count,
        col1: selected.col1,
        col2: selected.col2,
      };
      break;
    case "up":
      selectedNew = {
        row1: selected.row1 - count,
        row2: selected.row1 - 1,
        col1: selected.col1,
        col2: selected.col2,
      };
      break;
    case "left":
      selectedNew = {
        row1: selected.row1,
        row2: selected.row2,
        col1: selected.col1 - count,
        col2: selected.col1 - 1,
      };
      break;
    case "right":
      selectedNew = {
        row1: selected.row1,
        row2: selected.row2,
        col1: selected.col1 + 1,
        col2: selected.col1 + count,
      };
      break;
  }
  console.log(selected, selectedNew);

  const tbl = document
    .querySelector("td[data-mce-selected='1']")
    .closest("table");

  for (let rw = selectedNew.row1; rw <= selectedNew.row2; rw += 1) {
    for (let cl = selectedNew.col1; cl <= selectedNew.col2; cl += 1) {
      const tdNew = tbl.querySelector(
        `tbody > tr:nth-child(${rw + 1}) > td:nth-child(${cl + 1})`
      );
      if (!tdNew) throw `rw:${rw}, cl:${cl} not exists.`;

      tdNew.setAttribute("data-mce-selected", "1");
    }
  }
}

/*
--summary
선택된 셀 안에 탭과 줄바꿈으로 구분된 텍스트를 붙여넣음.
--example
pasteTsvToTable('a\tb\n1\t2')
*/
function pasteTsvToTable(value, rowSeparator = /\r?\n/) {
  const rows = value.split(rowSeparator);
  pasteRowsToTable(rows);
}

/*
--example
pasteRowsToTable(['a\tb', '1\t2'])
*/
function pasteRowsToTable(rows) {
  const region = getSelectedRegion();
  if (!region) {
    alert("No selected region.");
    return;
  }
  const { row1, row2, col1, col2 } = region;
  const rowLength = row2 - row1 + 1;

  const list = [];
  let rwSel = -1;
  while (rwSel < rowLength) {
    for (let rw = 0; rw < rows.length; rw++) {
      rwSel++;
      const cells = rows[rw].split("\t");
      list.push(cells);
    }
  }

  iterateSelected((td, i, row, col) => {
    const rowCur = row - row1;
    const colCur = col - col1;

    td.innerText = list[rowCur][colCur];
  });
}

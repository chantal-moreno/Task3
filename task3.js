const { randomBytes, createHmac } = require('node:crypto');

class KeyGenerator {
  constructor() {
    this.key = this.Key();
  }
  Key() {
    const buf = randomBytes(32);
    return buf.toString('hex');
  }
  getKey() {
    return this.key;
  }
}
class HMACGenerator {
  constructor(key) {
    this.key = key;
  }
  generateHMAC(pcMove) {
    const hash = createHmac('sha256', this.key).update(pcMove).digest('hex');
    console.log(`HMAC: ${hash}`);
    return hash;
  }
}

//Get array from console
const arg = process.argv;
arg.splice(0, 2);
const size = arg.length;

//Error Messages for invalid array
errorMsg(arg, size);

//Get key fo HMAC
const key = new KeyGenerator().getKey();
//Get pc move
const pc = movePC(arg, size);
//Get HMAC
const hmacGenerator = new HMACGenerator(key);
hmacGenerator.generateHMAC(pc);

//Game start
console.log('Available moves:');
//Menu display
for (let i = 0; i < size; i++) {
  console.log(`${i + 1} - ${arg[i]}`);
}
console.log('0 - exit');
console.log('? - help');
//Get user move
const user = moveUser(arg, size);

console.log(`Your move: ${arg[user]}`);
console.log(`Computer move: ${pc}`);
//Result
rules(pc, user, size, arg);

console.log(`HMAC key: ${key}`);
//Game end

function errorMsg(arg, size) {
  let errors = [];

  if (size === 0) {
    errors.push({
      message: 'ERROR: number of arguments equal to zero [].',
      suggestion: 'Enter arguments, example: arg1 arg2 arg3',
    });
  }

  if (size > 0 && size < 3) {
    errors.push({
      message: `ERROR: insufficient arguments [${arg.join(', ')}].`,
      suggestion: 'Enter a minimum of 3 arguments, example: arg1 arg2 arg3',
    });
  }

  if (size >= 3 && size % 2 === 0) {
    errors.push({
      message: `ERROR: the number of arguments is even {${size}} [${arg.join(
        ', '
      )}].`,
      suggestion: 'Enter an odd number of arguments, example: arg1 arg2 arg3',
    });
  }

  const duplicates = arg.filter((item, index) => arg.indexOf(item) !== index);
  if (duplicates.length > 0) {
    errors.push({
      message: `ERROR: argument repeated [${duplicates.join(', ')}].`,
      suggestion: 'Enter different arguments, example: dog cat mouse',
    });
  }

  if (errors.length > 0) {
    errors.forEach((error) => console.error(error.message, error.suggestion));
    process.exit(0);
  }

  return null;
}
function moveUser(arg, size) {
  //Get move input
  const prompt = require('prompt-sync')();
  let move;
  while (true) {
    move = prompt('Enter your move: ');
    if (move == 0) {
      console.log('Good Game');
      process.exit(0);
    } else if (move == '?') {
      tableGeneration(arg, size);
      continue;
    } else if (move > 0 && move <= size) {
      return move - 1;
    } else {
      console.log(
        `Error, the move [${move}] doesn't exist. Please enter a valid move.`
      );
    }
  }
}
function movePC(arg, size) {
  let move = Math.floor(Math.random() * size + 1);
  return String(arg[move - 1]);
}
function rules(movePC, moveUser, size, arg) {
  const half = Math.floor(size / 2);
  const indexMovePC = arg.indexOf(movePC);
  const result = Math.sign(
    ((indexMovePC - moveUser + half + size) % size) - half
  );
  if (result === -1) {
    return console.log(`You win!`);
  } else if (result === 1) {
    return console.log(`You lose`);
  } else {
    return console.log(`Draw`);
  }
}
function tableGeneration(arg, size) {
  var { AsciiTable3, AlignmentEnum } = require('ascii-table3');

  const half = Number(Math.floor(size / 2));
  let tableData = [];
  //Generate table
  for (let i = 0; i < size; i++) {
    let row = [`${arg[i]}`];
    for (let j = 0; j < size; j++) {
      let result = Math.sign(((i - j + half + size) % size) - half);
      if (result === 0) row.push('Draw');
      if (result === 1) row.push('Lose');
      if (result === -1) row.push('Win');
    }
    tableData.push(row);
  }
  //Table format
  let table = new AsciiTable3('Help Table')
    .setHeading('v Pc/User >', ...arg.map((move) => `${move}`))
    .setAlign(3, AlignmentEnum.CENTER)
    .addRowMatrix(tableData);

  console.log(table.toString());
}

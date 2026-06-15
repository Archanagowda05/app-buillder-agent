/*
  script.js - Calculator Logic
  Implements basic arithmetic, advanced math functions, and a simple memory store.
  No external libraries are used; only vanilla JavaScript.
*/

// ----- DOM Elements -----
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// ----- Calculator State -----
let currentOperand = '';
let previousOperand = null;
let operation = null;
let memory = 0; // Simple memory storage (not exposed via UI but available for future extensions)

// ----- Utility Functions -----
/**
 * Updates the calculator display with the provided value.
 * @param {string|number} value
 */
function updateDisplay(value) {
  display.value = String(value);
}

/**
 * Clears all current state and resets the display.
 */
function clearAll() {
  currentOperand = '';
  previousOperand = null;
  operation = null;
  updateDisplay('0');
}

/**
 * Formats a number to avoid long floating point artifacts.
 * Keeps up to 12 significant digits and removes trailing zeros.
 */
function formatNumber(num) {
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return 'Error';
  }
  // Use toPrecision to limit length, then trim unnecessary zeros.
  let str = Number(num).toPrecision(12);
  // Remove trailing zeros and possible trailing decimal point.
  str = str.replace(/\.?(0+)?$/g, (match) => (match.includes('.') ? '.' : ''));
  return str;
}

/**
 * Performs the pending binary operation.
 */
function compute() {
  if (operation === null || previousOperand === null) return;
  const a = previousOperand;
  const b = parseFloat(currentOperand) || 0;
  let result;
  switch (operation) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      result = b === 0 ? NaN : a / b;
      break;
    case 'pow':
      result = Math.pow(a, b);
      break;
    default:
      return;
  }
  const formatted = formatNumber(result);
  updateDisplay(formatted);
  // Reset state for further chaining.
  currentOperand = formatted;
  previousOperand = null;
  operation = null;
}

/**
 * Handles numeric button presses (0‑9).
 * @param {string} digit
 */
function inputDigit(digit) {
  // Prevent leading zeros like "00".
  if (currentOperand === '0' && digit === '0') return;
  if (currentOperand === '0' && digit !== '.') {
    currentOperand = digit;
  } else {
    currentOperand += digit;
  }
  updateDisplay(currentOperand);
}

/**
 * Handles decimal point input.
 */
function inputDecimal() {
  if (!currentOperand.includes('.')) {
    currentOperand = currentOperand ? currentOperand + '.' : '0.';
    updateDisplay(currentOperand);
  }
}

/**
 * Sets up a binary operation (add, subtract, multiply, divide, pow).
 * If there is already a pending operation, it computes it first.
 * @param {string} op
 */
function selectOperation(op) {
  if (currentOperand === '' && previousOperand === null) {
    // No operand entered yet – ignore.
    return;
  }
  if (previousOperand !== null && operation !== null && currentOperand !== '') {
    compute();
    // After compute, currentOperand holds the result.
  }
  previousOperand = parseFloat(currentOperand) || 0;
  operation = op;
  currentOperand = '';
}

/**
 * Executes an advanced unary function on the current operand.
 * @param {string} func - one of 'sqrt', 'sin', 'cos', 'tan'
 */
function applyUnaryFunction(func) {
  const value = parseFloat(currentOperand) || 0;
  let result;
  switch (func) {
    case 'sqrt':
      result = Math.sqrt(value);
      break;
    case 'sin':
      // Convert degrees to radians for user friendliness.
      result = Math.sin((value * Math.PI) / 180);
      break;
    case 'cos':
      result = Math.cos((value * Math.PI) / 180);
      break;
    case 'tan':
      result = Math.tan((value * Math.PI) / 180);
      break;
    default:
      return;
  }
  const formatted = formatNumber(result);
  updateDisplay(formatted);
  currentOperand = formatted;
}

/**
 * Memory functions – simple API for potential UI extensions.
 */
function memoryClear() {
  memory = 0;
}
function memoryRecall() {
  currentOperand = formatNumber(memory);
  updateDisplay(currentOperand);
}
function memoryAdd() {
  memory += parseFloat(currentOperand) || 0;
}
function memorySubtract() {
  memory -= parseFloat(currentOperand) || 0;
}

// ----- Event Handling -----
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    // Numeric buttons are identified by a single digit string.
    if (!isNaN(action)) {
      inputDigit(action);
      return;
    }
    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
      case 'pow':
        selectOperation(action);
        break;
      case 'equals':
        compute();
        break;
      case 'sqrt':
      case 'sin':
      case 'cos':
      case 'tan':
        applyUnaryFunction(action);
        break;
      // Future memory actions could be added here.
      default:
        // No action matched – ignore.
        break;
    }
  });
});

// Initialize display on load.
clearAll();

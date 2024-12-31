class PyitLangInterpreter {
    constructor() {
      this.variables = {};
      this.output = '';
    }
  
    // Execute PyitLang code from a string
    execute(code) {
      const lines = code.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      lines.forEach(line => this.processLine(line));
      return this.output;
    }
  
    // Process a single line of PyitLang code
    processLine(line) {
      if (line.startsWith("thatmat")) {
        this.declareVariable(line);
      } else if (line.startsWith("phyay")) {
        this.assignVariable(line);
      } else if (line.startsWith("pya")) {
        this.printStatement(line);
      } else if (line.startsWith("mahsaw")) {
        this.handleCondition(line);
      } else if (line.startsWith("akyein")) {
        this.handleLoop(line);
      } else if (line.startsWith("lohp")) {
        this.handleFunction(line);
      } else {
        this.output += `Syntax error: ${line}\n`;
      }
    }
  
    // Declare a variable
    declareVariable(line) {
      const regex = /^thatmat (\w+) = (.+)$/;
      const match = line.match(regex);
      if (match) {
        const [_, varName, value] = match;
        this.variables[varName] = this.evaluateExpression(value);
        this.output += `Variable '${varName}' declared with value: ${this.variables[varName]}\n`;
      } else {
        this.output += "Invalid variable declaration syntax.\n";
      }
    }
  
    // Assign a value to a variable
    assignVariable(line) {
      const regex = /^phyay (\w+) = (.+)$/;
      const match = line.match(regex);
      if (match) {
        const [_, varName, value] = match;
        if (this.variables.hasOwnProperty(varName)) {
          this.variables[varName] = this.evaluateExpression(value);
          this.output += `Variable '${varName}' assigned new value: ${this.variables[varName]}\n`;
        } else {
          this.output += `Variable '${varName}' is not defined.\n`;
        }
      } else {
        this.output += "Invalid assignment syntax.\n";
      }
    }
  
    // Print a statement
    printStatement(line) {
      const regex = /^pya (.+)$/;
      const match = line.match(regex);
      if (match) {
        const value = this.evaluateExpression(match[1]);
        this.output += value + "\n";
      } else {
        this.output += "Invalid print syntax.\n";
      }
    }
  
    // Evaluate an expression (like variables, numbers, etc.)
    evaluateExpression(expr) {
      expr = expr.trim();
      if (this.variables.hasOwnProperty(expr)) {
        return this.variables[expr];
      } else if (!isNaN(Number(expr))) {
        return Number(expr);
      } else {
        return expr;
      }
    }
  
    // Handle conditional statement
    handleCondition(line) {
      const regex = /^mahsaw (.+?) {([\s\S]+?)} mahoat {([\s\S]+?)}$/;
      const match = line.match(regex);
      if (match) {
        const condition = match[1].trim();
        const trueBlock = match[2].trim();
        const falseBlock = match[3].trim();
  
        const conditionResult = this.evaluateExpression(condition);
        if (conditionResult) {
          this.executeBlock(trueBlock);
        } else {
          this.executeBlock(falseBlock);
        }
      } else {
        this.output += `Invalid conditional syntax: ${line}\n`;
      }
    }
  
    // Execute block of code (i.e., contents inside curly braces)
    executeBlock(block) {
      const lines = block.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      lines.forEach(line => this.processLine(line));
    }
  
    // Handle loop statement
    handleLoop(line) {
      const regex = /^akyein (\d+) {([\s\S]+?)}$/;
      const match = line.match(regex);
      if (match) {
        const times = Number(match[1]);
        const block = match[2].trim();
  
        for (let i = 0; i < times; i++) {
          this.executeBlock(block);
        }
      } else {
        this.output += "Invalid loop syntax.\n";
      }
    }
  
    // Handle function definition or call
    handleFunction(line) {
      const regex = /^lohp (\w+)\((.*)\)$/;
      const match = line.match(regex);
      if (match) {
        const funcName = match[1];
        const args = match[2].split(',').map(arg => arg.trim());
  
        if (funcName === "getString") {
          // Handle getString function to take input from the user
          const input = prompt("Enter a value: ");
          if (input !== null) {
            this.output += `Input received: ${input}\n`;
          } else {
            this.output += "No input received.\n";
          }
        } else {
          this.output += `Unknown function: ${funcName}\n`;
        }
      } else {
        this.output += "Invalid function definition syntax.\n";
      }
    }
  }
  
  // Web Interface Logic
  function runCode() {
    const codeInput = document.getElementById('codeInput').value;
    const interpreter = new PyitLangInterpreter();
    const result = interpreter.execute(codeInput);
    document.getElementById('output').innerText = result;
  }
  
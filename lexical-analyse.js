function isDigit(char) {
  const charCode = char.charCodeAt(0)
  return '0'.charCodeAt(0) <= charCode && charCode <= '9'.charCodeAt(0)
}

function isIdentChar(char) {
  const charCode = char.charCodeAt(0)

  const isLowercase = 'a'.charCodeAt(0) <= charCode && charCode <= 'z'.charCodeAt(0)
  const isUppercase = 'A'.charCodeAt(0) <= charCode && charCode <= 'Z'.charCodeAt(0)
  const isUnderbar = charCode === '_'.charCodeAt(0)
  return isLowercase || isUppercase || isUnderbar
}

function countDigits(source) {
  let readPosition = 0
  while (readPosition < source.length) {
    if (!isDigit(source[readPosition])) {
      return readPosition
    }
    readPosition += 1
  }
  return readPosition
}

function countIdentChars(source) {
  let readPosition = 0
  while (readPosition < source.length) {
    if (!isIdentChar(source[readPosition])) {
      return readPosition
    }
    readPosition += 1
  }
  return readPosition
}

module.exports.lexicalAnalyse = function (source) {
  const tokens = []
  let readPosition = 0
  while (readPosition < source.length) {
    switch (source[readPosition]) {
      case '"':
      { let str = ""
        let escaped = false
        readPosition += 1
        while (true) {
          if (source.length <= readPosition) {
            tokens.push({
              type: 'UnknownCharacter',
              value: `"${str}`,
            })
            break
          } else if (source[readPosition] === '"' && !escaped) {
            tokens.push({
              type: 'String',
              value: str,
            })
            readPosition += 1 
            break
          } else {
            if (escaped) {
              switch(source[readPosition]){
                case "\\":
                  str += "\\"
                  break
                case 'n':
                  str += "\n"
                  break
                case 't':
                  str += "\t"
                  break
                case '"':
                  str += '"'
                  break
                default:
                  str += "\\" + source[readPosition];
              }
              escaped = false
            }else{
              if(source[readPosition] === "\\"){
                escaped = true
              }else{
                str += source[readPosition]
              }
            }
            readPosition += 1
          }
        }
        break }
      case '#':
        readPosition += 1
        while (readPosition < source.length) {
          if (source[readPosition] !== '\n') {
            readPosition += 1
          } else {
            readPosition += 1
            break
          }
        }
        break
      case '=':
        if (source[readPosition + 1] === '=') {
          tokens.push({ type: 'Identical' })
          readPosition += 2
        } else {
          tokens.push({ type: 'Equal' })
          readPosition += 1
        }
        break
      case '+':
        tokens.push({ type: 'Plus' })
        readPosition += 1
        break
      case '-':
        tokens.push({ type: 'Minus' })
        readPosition += 1
        break
      case '*':
        tokens.push({ type: 'Asterisk' })
        readPosition += 1
        break
      case '/':
        tokens.push({ type: 'Slash' })
        readPosition += 1
        break
      case '(':
        tokens.push({ type: 'LParen' })
        readPosition += 1
        break
      case ')':
        tokens.push({ type: 'RParen' })
        readPosition += 1
        break
      case '{':
        tokens.push({ type: 'LBrace' })
        readPosition += 1
        break
      case '}':
        tokens.push({ type: 'RBrace' })
        readPosition += 1
        break
      case ',':
        tokens.push({ type: 'Comma' })
        readPosition += 1
        break
      case ';':
        tokens.push({ type: 'Semicolon' })
        readPosition += 1
        break
      case ' ':
      case '\t':
      case '\n':
        readPosition += 1
        break
      default:
        if (isDigit(source[readPosition])) {
          const digitsCount = countDigits(source.slice(readPosition))
          tokens.push({
            type: 'Int',
            value: parseInt(source.slice(readPosition, readPosition + digitsCount), 10),
          })
          readPosition += digitsCount
        } else if (isIdentChar(source[readPosition])) {
          const identCharsCount = countIdentChars(source.slice(readPosition))
          const name = source.slice(readPosition, readPosition + identCharsCount)
          switch (name) {
            case 'if':
              tokens.push({
                type: 'If',
              })
              break
            case 'def':
              tokens.push({
                type: 'Def',
              })
              break
            case 'true':
            case 'false':
              tokens.push({
                type: 'Bool',
                value: name === 'true',
              })
              break
            case 'null':
              tokens.push({
                type: 'Null',
              })
              break
            default:
              tokens.push({
                type: 'Ident',
                name,
              })
          }
          readPosition += identCharsCount
        } else {
          // 不明な文字
          tokens.push({
            type: 'UnknownCharacter',
            value: source[readPosition],
          })
          readPosition += 1
        }
    }
  }
  return tokens
}

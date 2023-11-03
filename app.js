function evaluateExpression(expression, variables) {
    const sanitizedExpression = expression.replace(/[A-Z]+/g, function (match) {
        return variables[match] ? 'true' : 'false'
    })
    return eval(sanitizedExpression)
}

function sanitizeExpression(inputExpression) {
    inputExpression = inputExpression.replace(/\bAND\b/g, '&&')
    inputExpression = inputExpression.replace(/\bOR\b/g, '||')
    inputExpression = inputExpression.replace(/\bNOT\b/g, '!')
    return inputExpression
}

document.getElementById('generate-table').addEventListener('click', function () {
    const inputExpression = document.getElementById('expression').value
    const sanitizedExpression = sanitizeExpression(inputExpression)

    const uniqueVariables = [...new Set(sanitizedExpression.match(/[A-Z]/g))]
    const numRows = 1 << uniqueVariables.length

    if (uniqueVariables.length > 0) {
        const tableHead = document.querySelector('#truth-table thead tr')
        tableHead.innerHTML = uniqueVariables.map((variable) => `<th>${variable}</th>`).join('') + '<th>Result</th>'

        const tableBody = document.querySelector('#truth-table tbody')
        tableBody.innerHTML = ''

        for (let i = 0; i < numRows; i++) {
            const variables = {}
            uniqueVariables.forEach((variable, index) => {
                variables[variable] = Boolean(i & (1 << (uniqueVariables.length - 1 - index)))
            })

            const row = document.createElement('tr')
            row.innerHTML = uniqueVariables.map((variable) => `<td>${variables[variable]}</td>`).join('')
            const result = evaluateExpression(sanitizedExpression, variables)
            row.innerHTML += `<td>${result}</td>`
            tableBody.appendChild(row)
        }
    } else {
        alert('No variables found in the expression.')
    }
})

document.getElementById('clear').addEventListener('click', function () {
    document.getElementById('expression').value = ''
})

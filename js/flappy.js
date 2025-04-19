function novoElemento (tagName, className){
    const elem = document.createElement(tagName)

    elem.classList.add(className)
    return elem
}

function Barreira(reversa = false){
    this.elemento = novoElemento('div','barreira')

    const borda = novoElemento("div", "borda")
    const corpo = novoElemento("div", "corpo")

    this.elemento.appendChild(reversa ? corpo: borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () =>{
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior

        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 2

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //usar elemento quando sair da area do jogo
            if(par.getX()< -par.getLargura()){
                par.setX(this.pares.reduce((max, p) => Math.max(max, p.getX()), 0) + espaco)
                par.sortearAbertura()
            }
            const meio = largura/2

            const CruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio

            if(CruzouMeio) notificarPonto()
        })
    }
}


const barreiras = new Barreiras(700, 1200, 200, 400)
const areadojogo = document.querySelector('[wm-flappy]')
barreiras.pares.forEach(par => areadojogo.appendChild(par.elemento))

setInterval(()=>{
    barreiras.animar()
}, 10)

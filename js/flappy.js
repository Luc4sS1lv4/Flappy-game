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

    const deslocamento = 5

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //usar elemento quando sair da area do jogo
            if(par.getX()< -par.getLargura()){
                par.setX(this.pares.reduce((acumulador, posicaoAtual) => Math.max(acumulador, posicaoAtual.getX()), 0) + espaco)
                par.sortearAbertura()
            }
            const meio = largura/2

            const CruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio

            if(CruzouMeio) notificarPonto()
        })
    }
}

function passaro(alturaJogo){
    let voando = false
    this.elemento = novoElemento('img', 'passaro')

    this.elemento.src= 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () =>{
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMax = alturaJogo - this.elemento.clientHeight

        if(novoY < 0){
            this.setY(0)
        }else if(novoY >= alturaMax){
            this.setY(alturaMax)
        }else{
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo/2)
}


function Progresso(){
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos =>{
        this.elemento.innerHTML = pontos
    }
    
    this.atualizarPontos(0)
}

    function estaoSobrepostos (elementoA, elementoB){
        const a = elementoA.getBoundingClientRect()
        const b = elementoB.getBoundingClientRect()

        const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
        const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

        return horizontal && vertical

    }

    function colidiu (passaro, barreiras){
        let colidiu = false

        barreiras.pares.forEach(parDeBarreiras => {
            if(!colidiu){
                const superior = parDeBarreiras.superior.elemento
                const inferior = parDeBarreiras.inferior.elemento
                colidiu = estaoSobrepostos(passaro.elemento, superior) ||
                estaoSobrepostos(passaro.elemento, inferior)
            }
        })
        return colidiu
    }

    function flappy(){
        let pontos = 0
        
        const Areadojogo = document.querySelector("[wm-flappy]")
        const altura = Areadojogo.clientHeight
        const largura = Areadojogo.clientWidth
    
        const progresso = new Progresso()
        const barreiras = new Barreiras(altura, largura, 250, 500, () => progresso.atualizarPontos(++pontos))
    
        const Passaro = new passaro(altura)        
    
        Areadojogo.appendChild(progresso.elemento)
        Areadojogo.appendChild(Passaro.elemento)
        barreiras.pares.forEach(par => Areadojogo.appendChild(par.elemento))
    
        this.start = () => {
           const temporizador = setInterval(() => {
             barreiras.animar()
             Passaro.animar()
             
             if(colidiu(Passaro, barreiras)){
                clearInterval(temporizador)
             }
            }, 20)
        }
    }
    
    new flappy().start()  







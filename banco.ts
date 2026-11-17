class Cliente {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: Date;
    contas: Conta[] = [];

    constructor(id: number, nome: string, cpf: string, dataNascimento: Date) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }

    possuiConta(conta: Conta): boolean {
        for (let c of this.contas) {
            if (c === conta) {
                return true;
            }
        }
        return false;
    }
}



class Conta {
    id: number;
    numero: string;
    saldo: number;
    cliente!: Cliente;
    dataDeAbertura: Date;

    constructor(id: number, numero: string, saldo: number,
                dataDeAbertura: Date = new Date()) {
        this.id = id;
        this.numero = numero;
        this.saldo = saldo;
        this.dataDeAbertura = dataDeAbertura;
    }

    creditar(valor: number): void {
        this.saldo = this.saldo + valor;
    }

    debitar(valor: number): boolean {
        if (valor > 0 && this.saldo >= valor) {
            this.saldo = this.saldo - valor;
            return true;
        }

        return false;
    }

    transferir(destino: Conta, valor: number): boolean {
        if (this.debitar(valor)) {
            destino.creditar(valor);
            return true;
        }
        return false;
    }
}








class Banco {
    contas: Conta[] = [];
    clientes: Cliente[] = [];

    inserirConta(c: Conta): void {
        

        for (let conta of this.contas!) {
            if (c.numero == conta.numero || c.id == conta.id) {
                throw new Error("Conta possui mesmo id ou numero.")
            }
        }

        this.contas.push(c);
    }

    
    consultar(numero: string): Conta {
        let contaProcurada!: Conta;
        for (let c of this.contas) {
            if (c.numero == numero) {
                contaProcurada = c;
                break;
            }
        }
        return contaProcurada;
    }

    consultarIndice(numero: string): number {
        let indice: number = -1;
        for (let i: number = 0; i < this.contas.length; i++) {
            if (this.contas[i]!.numero == numero) {
                indice = i;
                break;
            }
        }
        return indice;
    }

    alterar(c: Conta): void {
        let indice = this.consultarIndice(c.numero);
        if (indice != -1) {
            this.contas[indice] = c;
        }
    }

    depositar(numero: string, valor: number): void {
        let conta: Conta = this.consultar(numero);
        if (conta != null) {
            conta.creditar(valor);
        }
    }

    sacar(numero: string, valor: number): void {
        let conta: Conta = this.consultar(numero);
        if (conta != null) {
            conta.debitar(valor);
        }
    }

    consultarSaldo(numero: string): number {
        let conta: Conta = this.consultar(numero);
        return conta.saldo;
    }

    transferir(numeroCredito: string, numeroDebito: string, valor: number): void {
        let contaCredito: Conta = this.consultar(numeroCredito);
        let contaDebito: Conta = this.consultar(numeroDebito);
        if (contaCredito != null && contaDebito != null) {
            contaDebito.transferir(contaCredito, valor);
        }
    }

    excluir(numero: string): void {
        let indice: number = this.consultarIndice(numero);

        if (indice != -1) {

            let conta = this.contas[indice]!;

            if (conta.cliente) { //se possui cliente
                let contasCliente = conta.cliente.contas;
                let pos = contasCliente.indexOf(conta);

                if (pos != -1) {
                    for (let i: number = pos; i < contasCliente.length - 1; i++) {
                        contasCliente[i]! = contasCliente[i + 1]!;
                    }
                contasCliente.pop();
                }

            }

            for (let i: number = indice; i < this.contas.length - 1; i++) {
                this.contas[i]! = this.contas[i + 1]!;
            }
            this.contas.pop();


        }
    }







    inserirCliente(cliente: Cliente): void {
        for (let c of this.clientes) {
            if (c.id == cliente.id || c.cpf == cliente.cpf) {
                throw new Error("Já possui cliente com o mesmo id ou cpf.");
            }
        }
        this.clientes.push(cliente);
    }

    consultarCliente(cpf: string): Cliente {
        let clienteProcurado!: Cliente;
        for (let c of this.clientes) {
            if (c.cpf == cpf) {
                clienteProcurado = c;
                break;
            }
        }
        return clienteProcurado;
    }



    consultarIndiceCliente(cpf: string): number {
        let indice: number = -1;
        for (let i: number = 0; i < this.clientes.length; i++) {
            if (this.clientes[i]!.cpf == cpf) {
                indice = i;
                break;
            }
        }
        return indice;
    }

    listarContasCliente(cpf: string): Conta[] {


        let cliente = this.consultarCliente(cpf);

        if (!cliente) { // nao encontrado
            throw new Error("Cliente não encontrado.");

        }

        return cliente.contas;

    }

    totalizarSaldoCliente(cpf: string): number {
        let contasCliente = this.listarContasCliente(cpf);
        let somatorio: number = 0;

        for (let conta of contasCliente) {
            somatorio += conta.saldo;
        }

        return somatorio;
    }

    totalContas(): number {
        let contador: number = 0;

        for (let conta of this.contas) {
            contador += 1;
        }

        return contador
    }

    totalSaldo(): number {
        let somatorio: number = 0;
        
        for (let conta of this.contas) {
            somatorio += conta.saldo;
        }

        return somatorio;
    }

    mediaSalarial(): number {
        return (this.totalSaldo() / this.totalContas());
    }




    
    excluirCliente(cpf: string) {
        let indice: number = this.consultarIndiceCliente(cpf);

        if (indice != -1) {

            let clienteContas = this.clientes[indice]!.contas;
            for (let conta of clienteContas) {
                this.excluir(conta.numero);
            }

        for (let i = indice; i < this.clientes.length; i++) {
            this.clientes[i]! = this.clientes[i++]!;
        }

        this.clientes.pop(); } else {
            throw new Error("Conta nao encontrada. ");
        }
    }

    ordemBancaria(numeroDebito: string, numerosCredito: string[], valor: number): void {
        if (valor <= 0) {
            throw new Error("O valor deve ser maior que zero");
        }
        if (numerosCredito.length == 0) {
            throw new Error("Nao há contas destino");
        }

        let origem: Conta = this.consultar(numeroDebito);
        let destinos: Conta[] = [];
        for (let numero of numerosCredito) {
            let destino: Conta = this.consultar(numero);
            if (destino === origem) {
                throw new Error("A conta de origem não pode ser destino");
            }
            destinos.push(destino);
        }

        let total: number = valor * destinos.length;
        if (origem.saldo < total) {
            throw new Error("Saldo insuficiente");
        }

        for (let destino of destinos) {
            origem.transferir(destino, valor);
        }


    }






}



function testar(descricao: string, condicao: boolean): void {

    if (condicao) {

        console.log(descricao);
    } else {
        console.log(descricao);
    }
}


function possuiErro(descricao: string, funcao: () => void): void {
    let possui = false;
    try {
        funcao();
    } catch (e) {
        possui = true;
    }
    testar(descricao, possui);
    
}



// const banco: Banco = new Banco();
// banco.inserirConta(new Conta(2, "102", 200));
// console.log(banco.consultar("102"))


let banco: Banco = new Banco();

banco.inserirConta(new Conta(1, "101", 100, new Date(2024, 0, 10)));
banco.inserirConta(new Conta(2, "102", 200));
banco.inserirConta(new Conta(3, "103", 300));
testar("insere 3 contas", banco.contas.length == 3);


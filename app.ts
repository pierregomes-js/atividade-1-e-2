import prompt from "prompt-sync";
import { Banco, Conta, Cliente } from "./banco.ts";
let input = prompt();
let b: Banco = new Banco();


class App {
    menu(): void {  
        let opcao: string = "";
        do {
            this.exibirMenu();
            opcao = input("Opção: ");

            this.executar(opcao);

            if (opcao != "0") {
                input("\nDigite <enter>");


        }  while { (opcao != "0"); }
        console.log("Fim");

    }


    exibirMenu(): void {
        console.log("App Banco\nDigite uma opção:");
        console.log("\nContas:");
        console.log("01 - Inserir        02 - Consultar      03 - Sacar");
        console.log("04 - Depositar      05 - Excluir        06 - Transferir");
        console.log("07 - Totalizações   08 - Ordem bancária 09 - Atualizar saldo");
        console.log("\nClientes:");
        console.log("20 - Inserir        21 - Consultar      22 - Associar conta");
        console.log("23 - Excluir        24 - Contas e saldo total do cliente");
        console.log("25 - Mudar titularidade de conta");
        console.log("26 - Contas sem titular (e atribuir)");
        console.log("27 - Atualizar dados do cliente");
        console.log("\n0 - Sair\n");

    }

    executar(opcao: string): void {
        switch (opcao) {
            case "01": this.inserir(); break;
            case "02": this.consultar(); break;
            case "03": this.sacar(); break;
            case "04": this.depositar(); break;
            case "05": this.excluirConta(); break;
            case "06": this.transferir(); break;
            case "07": this.totalizarSaldoCliente(); break;
            case "08": this.ordemBancaria(); break;
            case "09": this.atualizarConta(); break;
            case "20": this.inserirCliente(); break;
            case "21": this.consultarCliente(); break;
            case "22": this.associarConta(); break;
            case "23": this.excluirCliente(); break;
            case "24": this.contasDoCliente(); break;
            case "25": this.mudarTitularidade(); break;
            case "26": this.contasSemTitular(); break;
            case "27": this.atualizarCliente(); break;
            case "0": break;
            default: console.log("\nOpção inválida!");
        }


    }

}




let app: App = new App();
app.banco.carregarDados();
app.menu();

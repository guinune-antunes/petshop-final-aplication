<?php
$pageTitle = 'PDV - Vendas';
$paginaAtiva = 'vendas';
include 'includes/_head.php';
require 'conexao.php';
require 'includes/verifica_login.php';
// 1. Busca CLIENTES para o dropdown
$stmt_clientes = $pdo->query("SELECT id, nome_completo FROM clientes ORDER BY nome_completo");
$clientes = $stmt_clientes->fetchAll();

// 2. Busca PRODUTOS para o acesso rápido (apenas com estoque)
$stmt_produtos = $pdo->query("SELECT * FROM produtos WHERE quantidade > 0 ORDER BY nome LIMIT 15");
$produtosRapidos = $stmt_produtos->fetchAll();
?>

<style>
    .pdv-container {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 20px;
        height: calc(100vh - 130px); /* Ajuste conforme seu header */
        padding-bottom: 10px;
    }
    /* Coluna Esquerda */
    .pdv-left-panel { display: flex; flex-direction: column; gap: 20px; height: 100%; }
    .product-search-area { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .quick-products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 10px;
        overflow-y: auto;
        padding: 5px;
        flex-grow: 1; /* Ocupa o resto do espaço */
    }
    .product-card-btn {
        background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;
        text-align: center; cursor: pointer; transition: all 0.2s;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100px;
    }
    .product-card-btn:hover { border-color: var(--color-primary); background-color: #f0fcf9; transform: translateY(-2px); }
    .product-card-btn i { font-size: 1.5rem; color: var(--color-primary); margin-bottom: 5px; }
    .product-card-btn span { font-size: 0.8rem; font-weight: 500; line-height: 1.2; }
    .product-card-btn small { color: #777; font-size: 0.75rem; margin-top: 5px; }

    /* Coluna Direita (Cupom) */
    .pdv-right-panel {
        background: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        display: flex; flex-direction: column; height: 100%; border: 1px solid #e0e0e0;
    }
    .ticket-header { padding: 15px; background-color: var(--color-dark); color: #fff; border-radius: 8px 8px 0 0; }
    .client-selector select { width: 100%; padding: 8px; border-radius: 4px; border: none; font-size: 0.9rem; margin-top: 10px; }
    .ticket-body { flex-grow: 1; overflow-y: auto; background-color: #f9f9f9; }
    .ticket-table { width: 100%; border-collapse: collapse; }
    .ticket-table th { background: #eee; padding: 8px; text-align: left; font-size: 0.8rem; position: sticky; top: 0; }
    .ticket-table td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 0.9rem; }
    .ticket-item-remove { color: var(--color-danger); cursor: pointer; }
    
    .ticket-footer { padding: 15px; background-color: #fff; border-top: 2px dashed #ccc; border-radius: 0 0 8px 8px; }
    .total-display { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .total-value { font-size: 1.8rem; font-weight: 700; color: var(--color-primary); }
    .payment-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .btn-finalize { grid-column: span 2; background-color: var(--color-success); color: white; padding: 12px; font-size: 1.1rem; border:none; border-radius:6px; cursor:pointer; }
    .btn-finalize:disabled { background-color: #ccc; cursor: not-allowed; }
</style>

<?php include 'includes/_sidebar.php'; ?>

<div class="main-area">
    <div class="content-wrapper">
        <?php include 'includes/_header.php'; ?>

        <main class="main-content">
            
            <div class="pdv-container">
                
                <div class="pdv-left-panel">
                    
                    <div class="product-search-area">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label><i class="fas fa-barcode"></i> Buscar Produto (Nome ou Código)</label>
                            <input type="text" id="pdv-search" class="form-control" placeholder="Digite ou bipe o código..." autofocus autocomplete="off">
                        </div>
                    </div>

                    <h4 style="margin-bottom: 5px; color: #555;">Acesso Rápido</h4>
                    <div class="quick-products-grid">
                        <button class="product-card-btn" onclick="adicionarServicoAvulso('Banho Avulso', 50.00)">
                            <i class="fas fa-bath"></i>
                            <span>Banho Avulso</span>
                            <small>R$ 50,00</small>
                        </button>

                        <?php foreach ($produtosRapidos as $prod): ?>
                            <button class="product-card-btn" 
                                    onclick="adicionarAoCarrinho(<?php echo $prod['id']; ?>, '<?php echo addslashes($prod['nome']); ?>', <?php echo $prod['preco']; ?>)">
                                <i class="fas fa-box"></i>
                                <span><?php echo substr($prod['nome'], 0, 18) . '...'; ?></span>
                                <small>R$ <?php echo number_format($prod['preco'], 2, ',', '.'); ?></small>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="pdv-right-panel">
                    <div class="ticket-header">
                        <div style="display: flex; justify-content: space-between;">
                            <span><i class="fas fa-shopping-cart"></i> Venda Atual</span>
                        </div>
                        <div class="client-selector">
                            <select id="pdv-cliente">
                                <option value="">Cliente Balcão (Não identificado)</option>
                                <?php foreach ($clientes as $c): ?>
                                    <option value="<?php echo $c['id']; ?>"><?php echo htmlspecialchars($c['nome_completo']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="ticket-body">
                        <table class="ticket-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th width="40">Qtd</th>
                                    <th width="70">Total</th>
                                    <th width="20"></th>
                                </tr>
                            </thead>
                            <tbody id="carrinho-lista">
                                </tbody>
                        </table>
                    </div>

                    <div class="ticket-footer">
                        <div class="total-display">
                            <span class="total-label">TOTAL</span>
                            <span class="total-value" id="total-venda">R$ 0,00</span>
                        </div>

                        <div class="form-group-row" style="margin-bottom: 10px;">
                            <div class="form-group">
                                <label>Desconto (R$)</label>
                                <input type="number" id="desconto-valor" value="0.00" step="0.50" onchange="atualizarInterfaceCarrinho()">
                            </div>
                            <div class="form-group">
                                <label>Pagamento</label>
                                <select id="forma-pagamento">
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Pix">Pix</option>
                                    <option value="Cartão Crédito">Crédito</option>
                                    <option value="Cartão Débito">Débito</option>
                                </select>
                            </div>
                        </div>

                        <div class="payment-actions">
                            <button class="btn btn-secondary" onclick="limparCarrinho()">Cancelar</button>
                            <button class="btn btn-finalize" onclick="finalizarVenda()">
                                <i class="fas fa-check"></i> Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</div>

<script>
    let carrinho = [];
    let totalGlobal = 0;

    // 1. BUSCA DE PRODUTOS
    const searchInput = document.getElementById('pdv-search');
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const termo = this.value;
            if(termo.length > 0) buscarProduto(termo);
        }
    });

    function buscarProduto(termo) {
        fetch(`buscar_produto_pdv.php?termo=${termo}`)
            .then(res => res.json())
            .then(produtos => {
                if (produtos.length === 1) {
                    const p = produtos[0];
                    adicionarAoCarrinho(p.id, p.nome, p.preco);
                    searchInput.value = ''; 
                    searchInput.focus();
                } else if (produtos.length > 1) {
                    alert('Muitos produtos encontrados. Tente ser mais específico.');
                } else {
                    alert('Produto não encontrado!');
                }
            })
            .catch(err => console.error('Erro na busca:', err));
    }

    // 2. GERENCIAMENTO DO CARRINHO
    function adicionarAoCarrinho(id, nome, preco) {
        const itemExistente = carrinho.find(item => item.id == id);
        if (itemExistente) {
            itemExistente.qtd++;
        } else {
            carrinho.push({ id: parseInt(id), nome: nome, preco: parseFloat(preco), qtd: 1 });
        }
        atualizarInterfaceCarrinho();
    }

    function adicionarServicoAvulso(nome, preco) {
        const idTemp = -Date.now(); // ID negativo para serviços não cadastrados
        carrinho.push({ id: idTemp, nome: nome, preco: parseFloat(preco), qtd: 1 });
        atualizarInterfaceCarrinho();
    }

    function removerItem(index) {
        carrinho.splice(index, 1);
        atualizarInterfaceCarrinho();
    }

    function atualizarInterfaceCarrinho() {
        const tbody = document.getElementById('carrinho-lista');
        const totalEl = document.getElementById('total-venda');
        const desconto = parseFloat(document.getElementById('desconto-valor').value) || 0;
        
        tbody.innerHTML = '';
        let subtotalCarrinho = 0;

        carrinho.forEach((item, index) => {
            const totalItem = item.preco * item.qtd;
            subtotalCarrinho += totalItem;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.qtd}</td>
                <td>R$ ${totalItem.toFixed(2)}</td>
                <td><i class="fas fa-times ticket-item-remove" onclick="removerItem(${index})"></i></td>
            `;
            tbody.appendChild(tr);
        });

        totalGlobal = subtotalCarrinho - desconto;
        if(totalGlobal < 0) totalGlobal = 0;

        totalEl.textContent = 'R$ ' + totalGlobal.toFixed(2);
    }

    function limparCarrinho() {
        if(confirm('Limpar a venda atual?')) {
            carrinho = [];
            document.getElementById('desconto-valor').value = "0.00";
            atualizarInterfaceCarrinho();
        }
    }

    // 3. FINALIZAR VENDA
    function finalizarVenda() {
        if (carrinho.length === 0) {
            alert('O carrinho está vazio!');
            return;
        }

        const btn = document.querySelector('.btn-finalize');
        const textoOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

        const dadosVenda = {
            cliente_id: document.getElementById('pdv-cliente').value || null,
            total_venda: totalGlobal,
            desconto: parseFloat(document.getElementById('desconto-valor').value) || 0,
            forma_pagamento: document.getElementById('forma-pagamento').value,
            itens: carrinho
        };

        fetch('salvar_venda.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosVenda)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('Venda realizada com sucesso!');
                carrinho = [];
                document.getElementById('desconto-valor').value = "0.00";
                document.getElementById('pdv-cliente').value = "";
                atualizarInterfaceCarrinho();
            } else {
                alert('Erro: ' + result.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Erro de comunicação.');
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
        });
    }
</script>

<?php include 'includes/_footer.php'; ?>
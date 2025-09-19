document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('dynamicForm');
      const itemContainer = document.getElementById('item-container');
      const addItemBtn = 0;//document.getElementById('addItemBtn');
      const webhookUrl = 'https://pruebanochon-fdhfbpaehvhmgdbx.chilecentral-01.azurewebsites.net/webhook-test/a5d568d4-e3d7-4af7-a00e-4a7198263d6f'; // ¡IMPORTANTE! Reemplaza esto con tu URL de Webhook de n8n.

      let rowCount = 0;

      // Función para crear y agregar una nueva fila
      function createItemRow() {
        rowCount++;
        const newRow = document.createElement('div');
        newRow.classList.add('item-row');
        newRow.innerHTML = `
                    <div class="row">
                        <input type="text" name="itemName-${rowCount}" placeholder="Nombre del Ítem" required>
                        <input type="number" name="quantity-${rowCount}" placeholder="Cantidad" required>
                        <button type="button" class="removeItemBtn">🗑️</button>
                    </div>
                `;
        itemContainer.appendChild(newRow);

        // Agregar el evento al nuevo botón de eliminar
        newRow.querySelector('.removeItemBtn').addEventListener('click', () => {
          itemContainer.removeChild(newRow);
        });
      }

      // Agrega una fila inicial al cargar
      createItemRow();

      // Evento para el botón de agregar
      addItemBtn.addEventListener('click', createItemRow);

      // Evento para el envío del formulario
      form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el envío tradicional del formulario

        const formData = new FormData(form);
        const dataToSend = {
          reportName: formData.get('reportName'),
          items: [] // Aquí se almacenarán las filas dinámicas como un array de objetos
        };

        // Recorre todas las filas de ítems y las añade al array
        const itemRows = itemContainer.querySelectorAll('.item-row');
        itemRows.forEach(row => {
          const itemName = row.querySelector('input[name^="itemName"]').value;
          const quantity = row.querySelector('input[name^="quantity"]').value;
          dataToSend.items.push({
            itemName,
            quantity: parseInt(quantity)
          });
        });

        console.log('Datos a enviar:', dataToSend);

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            alert('Datos enviados a n8n con éxito!');
            form.reset();
            itemContainer.innerHTML = ''; // Limpia las filas
            createItemRow(); // Agrega la primera fila nuevamente
          } else {
            alert('Error al enviar los datos a n8n.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error de conexión.');
        }
      });
    });
  
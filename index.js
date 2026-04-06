const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/zendesk-webhook", async (req, res) => {
  const { ticket_id, nome, pedido } = req.body;

  if (!ticket_id || !pedido) {
    return res.status(400).send("Dados inválidos");
  }

  try {
    await axios.put(
      `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${ticket_id}.json`,
      {
        ticket: {
          subject: `Cliente ${nome} Pedido ${pedido}`,
        },
      },
      {
        auth: {
          username: `${process.env.ZENDESK_EMAIL}/token`,
          password: process.env.ZENDESK_API_TOKEN,
        },
      }
    );

    return res.sendStatus(200);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Servidor rodando..."));

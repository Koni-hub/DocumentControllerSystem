import { DataTypes } from "sequelize";
import database from "../config/dbConfig.js";

const Recipient = database.define(
  "recipients",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    document_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "recorddocuments",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM(
        "For approval/signature",
        "For comments",
        "For filing/archiving",
        "For appropriate action",
        "For information"
      ),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        "Archived",
        "To Receive",
        "Pending",
        "Received",
        "Declined"
      ),
      defaultValue: "To Receive",
    },
    declined_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forwardedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

(async () => {
  try {
    const tableExists = await database
      .getQueryInterface()
      .showAllTables()
      .then((tables) => tables.includes("recipients"));

    if (!tableExists) {
      console.info("Table does not exist. Syncing database...");
      await database.sync();
    } else {
      console.info("Table already exists. Skipping sync.");
    }
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

export default Recipient;

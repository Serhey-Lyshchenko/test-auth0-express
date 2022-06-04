const express = require("express");
const {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require("./organizations.service");
const { checkJwt } = require("../middleware/check-jwt.middleware");
const {
  checkPermissions,
} = require("../middleware/check-permissions.middleware");
const { OrganizationsPermissions } = require("./organizations-permissions");

const organizationsRouter = express.Router();

organizationsRouter.get(
  "/get-all",
  checkJwt,
  checkPermissions(OrganizationsPermissions.Read),
  (req, res) => {
    const message = getOrganizations();

    res.status(200).json(message);
  }
);

organizationsRouter.get(
  "/create",
  checkJwt,
  checkPermissions(OrganizationsPermissions.Create),
  (req, res) => {
    const message = createOrganization();

    res.status(200).json(message);
  }
);

organizationsRouter.get(
  "/update",
  checkJwt,
  checkPermissions(OrganizationsPermissions.Update),
  (req, res) => {
    const message = updateOrganization();

    res.status(200).json(message);
  }
);

organizationsRouter.get(
  "/delete",
  checkJwt,
  checkPermissions(OrganizationsPermissions.Delete),
  (req, res) => {
    const message = deleteOrganization();

    res.status(200).json(message);
  }
);



module.exports = { organizationsRouter };

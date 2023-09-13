import { rest } from "msw";
import { setupServer } from "msw/node";

// Handle mocked behavior when test components make API requests
const server = setupServer(
  rest.get("../api/fhir/Citation/$get-artifact-types", (req, res, ctx) => {
    return res(
      ctx.json({
        parameter: [
          {
            name: "artifact-type",
            valueCoding: {
              display: "Abstract",
            },
          },
          {
            name: "artifact-type",
            valueCoding: {
              display: "General Recommendation",
            },
          },
        ],
        resourceType: "Parameters",
      })
    );
  }),
  rest.get("../api/fhir/CodeSystem/$get-mesh-children", (req, res, ctx) => {
    const code = req.url.searchParams.get("code");
    // If needed, provide logic on what to return based on code. Below is for tree root
    return res(
      ctx.json({
        parameter: [
          {
            name: "concept",
            valueCoding: {
              extension: [
                {
                  url: "https://cds.ahrq.gov/cedar/api/fhir/StructureDefinition/extension-mesh-tree-number",
                  valueCode: "C",
                },
                {
                  url: "https://cds.ahrq.gov/cedar/api/fhir/StructureDefinition/extension-mesh-has-children",
                  valueBoolean: true,
                },
                {
                  url: "https://cds.ahrq.gov/cedar/api/fhir/StructureDefinition/extension-mesh-direct-artifact-count",
                  valueUnsignedInt: 0,
                },
                {
                  url: "https://cds.ahrq.gov/cedar/api/fhir/StructureDefinition/extension-mesh-indirect-artifact-count",
                  valueUnsignedInt: 3718,
                },
              ],
              system: "https://www.nlm.nih.gov/mesh",
              display: "Diseases",
            },
          },
        ],
        resourceType: "Parameters",
      })
    );
  }),
  rest.get("../api/fhir/Organization", (req, res, ctx) => {
    return res(
      ctx.json({
        type: "searchset",
        total: 2,
        link: [
          {
            relation: "self",
            url: "http://localhost:4567/fhir/Organization",
          },
        ],
        entry: [
          {
            resource: {
              id: "cds-connect",
              extension: [
                {
                  url: "https://cds.ahrq.gov/cedar/api/fhir/StructureDefinition/extension-organization-description",
                  valueString:
                    "CDS Connect provides Clinical Decision Support artifacts that are based on clinical practice guidelines, peer-reviewed articles, best practices, and other content identified via PCOR.",
                },
              ],
              name: "CDS Connect",
              alias: ["CDS Connect"],
              telecom: [
                {
                  system: "url",
                  value: "https://cds.ahrq.gov/cdsconnect",
                },
              ],
              resourceType: "Organization",
            },
          },
          // {
          //   resource: {
          //     id: "epc",
          //     extension: [
          //       {
          //         url: "https://cds.ahrq.gov/cedar/api/fhir/StructureDefinition/extension-organization-description",
          //         valueString:
          //           "Evidence-based Practice Centers are academic and other research institutions contracted by the EHC Program to evaluate and summarize healthcare evidence.",
          //       },
          //     ],
          //     name: "Evidence-based Practice Center Program",
          //     alias: ["EPC"],
          //     telecom: [
          //       {
          //         system: "url",
          //         value:
          //           "https://www.ahrq.gov/research/findings/evidence-based-reports/index.html",
          //       },
          //     ],
          //     resourceType: "Organization",
          //   },
          // },
        ],
        resourceType: "Bundle",
      })
    );
  })
);

module.exports = server;

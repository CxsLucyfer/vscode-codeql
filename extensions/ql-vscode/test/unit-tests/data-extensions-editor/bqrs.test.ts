import { decodeBqrsToExternalApiUsages } from "../../../src/data-extensions-editor/bqrs";
import { DecodedBqrsChunk } from "../../../src/common/bqrs-cli-types";
import { CallClassification } from "../../../src/data-extensions-editor/external-api-usage";

describe("decodeBqrsToExternalApiUsages", () => {
  const chunk: DecodedBqrsChunk = {
    columns: [
      { name: "usage", kind: "Entity" },
      { name: "apiName", kind: "String" },
      { kind: "String" },
      { kind: "String" },
      { kind: "String" },
      { kind: "String" },
      { name: "type", kind: "String" },
      { kind: "String" },
      { name: "classification", kind: "String" },
      { kind: "String" },
    ],
    tuples: [
      [
        {
          label: "println(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 29,
            startColumn: 9,
            endLine: 29,
            endColumn: 49,
          },
        },
        "java.io.PrintStream#println(String)",
        "true",
        "supported",
        "rt.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "run(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/Sql2oExampleApplication.java",
            startLine: 9,
            startColumn: 9,
            endLine: 9,
            endColumn: 66,
          },
        },
        "org.springframework.boot.SpringApplication#run(Class,String[])",
        "false",
        "supported",
        "spring-boot-3.0.2.jar",
        "",
        "none",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "createQuery(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 15,
            startColumn: 13,
            endLine: 15,
            endColumn: 56,
          },
        },
        "org.sql2o.Connection#createQuery(String)",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "createQuery(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 26,
            startColumn: 13,
            endLine: 26,
            endColumn: 39,
          },
        },
        "org.sql2o.Connection#createQuery(String)",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "executeScalar(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 15,
            startColumn: 13,
            endLine: 15,
            endColumn: 85,
          },
        },
        "org.sql2o.Query#executeScalar(Class)",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "executeScalar(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 26,
            startColumn: 13,
            endLine: 26,
            endColumn: 68,
          },
        },
        "org.sql2o.Query#executeScalar(Class)",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "open(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 14,
            startColumn: 24,
            endLine: 14,
            endColumn: 35,
          },
        },
        "org.sql2o.Sql2o#open()",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "open(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 25,
            startColumn: 24,
            endLine: 25,
            endColumn: 35,
          },
        },
        "org.sql2o.Sql2o#open()",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "new Sql2o(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 10,
            startColumn: 33,
            endLine: 10,
            endColumn: 88,
          },
        },
        "org.sql2o.Sql2o#Sql2o(String,String,String)",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
      [
        {
          label: "new Sql2o(...)",
          url: {
            uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
            startLine: 23,
            startColumn: 23,
            endLine: 23,
            endColumn: 36,
          },
        },
        "org.sql2o.Sql2o#Sql2o(String)",
        "true",
        "supported",
        "sql2o-1.6.0.jar",
        "",
        "sink",
        "type",
        "source",
        "classification",
      ],
    ],
  };

  it("extracts api usages", () => {
    // Even though there are a number of usages with the same number of usages, the order returned should be stable:
    // - Iterating over a map (as done by .values()) is guaranteed to be in insertion order
    // - Sorting the array of usages is guaranteed to be a stable sort
    expect(decodeBqrsToExternalApiUsages(chunk)).toEqual([
      {
        library: "rt",
        libraryVersion: undefined,
        signature: "java.io.PrintStream#println(String)",
        packageName: "java.io",
        typeName: "PrintStream",
        methodName: "println",
        methodParameters: "(String)",
        supported: true,
        supportedType: "sink",
        usages: [
          {
            label: "println(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 29,
              startColumn: 9,
              endLine: 29,
              endColumn: 49,
            },
            classification: CallClassification.Source,
          },
        ],
      },
      {
        library: "spring-boot",
        libraryVersion: "3.0.2",
        signature:
          "org.springframework.boot.SpringApplication#run(Class,String[])",
        packageName: "org.springframework.boot",
        typeName: "SpringApplication",
        methodName: "run",
        methodParameters: "(Class,String[])",
        supported: false,
        supportedType: "none",
        usages: [
          {
            label: "run(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/Sql2oExampleApplication.java",
              startLine: 9,
              startColumn: 9,
              endLine: 9,
              endColumn: 66,
            },
            classification: CallClassification.Source,
          },
        ],
      },
      {
        library: "sql2o",
        libraryVersion: "1.6.0",
        signature: "org.sql2o.Connection#createQuery(String)",
        packageName: "org.sql2o",
        typeName: "Connection",
        methodName: "createQuery",
        methodParameters: "(String)",
        supported: true,
        supportedType: "sink",
        usages: [
          {
            label: "createQuery(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 15,
              startColumn: 13,
              endLine: 15,
              endColumn: 56,
            },
            classification: CallClassification.Source,
          },
          {
            label: "createQuery(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 26,
              startColumn: 13,
              endLine: 26,
              endColumn: 39,
            },
            classification: CallClassification.Source,
          },
        ],
      },
      {
        library: "sql2o",
        libraryVersion: "1.6.0",
        signature: "org.sql2o.Query#executeScalar(Class)",
        packageName: "org.sql2o",
        typeName: "Query",
        methodName: "executeScalar",
        methodParameters: "(Class)",
        supported: true,
        supportedType: "sink",
        usages: [
          {
            label: "executeScalar(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 15,
              startColumn: 13,
              endLine: 15,
              endColumn: 85,
            },
            classification: CallClassification.Source,
          },
          {
            label: "executeScalar(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 26,
              startColumn: 13,
              endLine: 26,
              endColumn: 68,
            },
            classification: CallClassification.Source,
          },
        ],
      },
      {
        library: "sql2o",
        libraryVersion: "1.6.0",
        signature: "org.sql2o.Sql2o#open()",
        packageName: "org.sql2o",
        typeName: "Sql2o",
        methodName: "open",
        methodParameters: "()",
        supported: true,
        supportedType: "sink",
        usages: [
          {
            label: "open(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 14,
              startColumn: 24,
              endLine: 14,
              endColumn: 35,
            },
            classification: CallClassification.Source,
          },
          {
            label: "open(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 25,
              startColumn: 24,
              endLine: 25,
              endColumn: 35,
            },
            classification: CallClassification.Source,
          },
        ],
      },
      {
        library: "sql2o",
        libraryVersion: "1.6.0",
        signature: "org.sql2o.Sql2o#Sql2o(String,String,String)",
        packageName: "org.sql2o",
        typeName: "Sql2o",
        methodName: "Sql2o",
        methodParameters: "(String,String,String)",
        supported: true,
        supportedType: "sink",
        usages: [
          {
            label: "new Sql2o(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 10,
              startColumn: 33,
              endLine: 10,
              endColumn: 88,
            },
            classification: CallClassification.Source,
          },
        ],
      },
      {
        library: "sql2o",
        libraryVersion: "1.6.0",
        signature: "org.sql2o.Sql2o#Sql2o(String)",
        packageName: "org.sql2o",
        typeName: "Sql2o",
        methodName: "Sql2o",
        methodParameters: "(String)",
        supported: true,
        supportedType: "sink",
        usages: [
          {
            label: "new Sql2o(...)",
            url: {
              uri: "file:/home/runner/work/sql2o-example/sql2o-example/src/main/java/org/example/HelloController.java",
              startLine: 23,
              startColumn: 23,
              endLine: 23,
              endColumn: 36,
            },
            classification: CallClassification.Source,
          },
        ],
      },
    ]);
  });
});

import {StackContext, NextjsSite, } from "sst/constructs";
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  IpAddresses,
  Port,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";

const DATABASE_NAME = "delete_me_db";
const DATABASE_USERNAME = "deletemedbuser";

export function AwesomeStack({stack, app}: StackContext) {
  app.setDefaultRemovalPolicy("destroy");

  // create vpc
  let vpc = new Vpc(stack, "delete-me-vpc", {
    ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
    subnetConfiguration: [
      {
        name: "Public",
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24,
      },
      {
        name: "Private",
        subnetType: SubnetType.PRIVATE_ISOLATED,
        cidrMask: 24,
      },
    ],
  });

  // create RDS database instance (postgres)
  let db = new DatabaseInstance(stack, "delete-me-db", {
    engine: DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_14_5,
    }),
    vpc,
    vpcSubnets: {
      subnetType: SubnetType.PUBLIC,
    },
    publiclyAccessible: true,
    databaseName: DATABASE_NAME,
    instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
    allocatedStorage: 20,
    credentials: {
      username: DATABASE_USERNAME,
    },
  });

  db.connections.allowFromAnyIpv4(Port.tcp(5432));

  let site = new NextjsSite(stack, "NextjsApp", {
    path: "packages/todo-app/",
    environment: {
      REGION: app.region,
    },
    cdk: {
      server: {
        vpc,
      }
    }
  });

  stack.addOutputs({
    URL: site.url || "",
    DatabaseURL: db.dbInstanceEndpointAddress,
    DatabaseUser: "deletemedbuser",
  });
}

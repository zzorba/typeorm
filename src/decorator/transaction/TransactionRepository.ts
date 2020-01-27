import {getMetadataArgsStorage} from "../../";
import {TransactionRepositoryMetadataArgs} from "../../metadata-args/TransactionRepositoryMetadataArgs";
import {CannotReflectMethodParameterTypeError} from "../../error/CannotReflectMethodParameterTypeError";

/**
 * Injects transaction's repository into the method wrapped with @Transaction decorator.
 *
 * @deprecated
 */
export function TransactionRepository(entityType?: Function): ParameterDecorator {
    return (object: Object, methodName: string, index: number) => {

        // get repository type
        let repositoryType: "Repository" | "TreeRepository" | "MongoRepository"; // todo: this won't work, but we are removing this repository anyway
        try {
            repositoryType = Reflect.getOwnMetadata("design:paramtypes", object, methodName)[index];
        } catch (err) {
            throw new CannotReflectMethodParameterTypeError(object.constructor, methodName);
        }

        getMetadataArgsStorage().transactionRepositories.push({
            target: object.constructor,
            methodName,
            index,
            repositoryType,
            entityType,
        } as TransactionRepositoryMetadataArgs);
    };
}

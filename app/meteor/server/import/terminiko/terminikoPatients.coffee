@Import ||= {}
@Import.Terminiko ||= {}

@Import.Terminiko.upsertPatients = (job) ->
  Import.Mdb
    path: job.data.path
    table: 'Patienten'
    progress: job
    progressFactor: 0.3
    delete: false
    iterator: (record) ->
      operation =
        selector:
          'external.eoswin.id': record.pat_id_a.toString()
        $set:
          'external.terminiko.id': record.Kennummer.toString()
          'external.terminiko.note': record.Info

    bulk: (operations) ->
      bulk = Patients.rawCollection().initializeUnorderedBulkOp()

      for i in [0...operations.length]
        operation = operations[i]
        bulk
          .find(operation.selector)
          .updateOne($set: operation.$set)

      if Meteor.wrapAsync(bulk.execute, bulk)().ok is not 1
        job.log("Terminiko: upsertPatients: Bulk execute error: #{JSON.stringify(d)}")
        job.fail()

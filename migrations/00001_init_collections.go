package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// ---------------------------------------------------------------
		// 1. users
		// ---------------------------------------------------------------
		users := core.NewBaseCollection("users")
		users.Fields.Add(
			&core.TextField{Name: "username", Required: true, Unique: true},
			&core.TextField{Name: "password", Required: true},
			&core.TextField{Name: "role", Required: true}, // "ADMIN" or "STAFF"
			&core.TextField{Name: "session_id"},
			&core.TextField{Name: "app_session_id"},
			&core.BoolField{Name: "is_active", Required: false},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		users.ListRule = types.Pointer("")
		users.ViewRule = types.Pointer("")
		users.CreateRule = types.Pointer("")
		users.UpdateRule = types.Pointer("")
		users.DeleteRule = types.Pointer("")
		if err := app.Save(users); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 2. customers
		// ---------------------------------------------------------------
		customers := core.NewBaseCollection("customers")
		customers.Fields.Add(
			&core.TextField{Name: "name", Required: true},
			&core.TextField{Name: "phone", Required: true},
			&core.TextField{Name: "email"},
			&core.TextField{Name: "address"},
			&core.TextField{Name: "location"},
			&core.TextField{Name: "serial_no"},
			&core.TextField{Name: "delivery_date"},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		customers.ListRule = types.Pointer("")
		customers.ViewRule = types.Pointer("")
		customers.CreateRule = types.Pointer("")
		customers.UpdateRule = types.Pointer("")
		customers.DeleteRule = types.Pointer("")
		if err := app.Save(customers); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 3. complaints
		// ---------------------------------------------------------------
		complaints := core.NewBaseCollection("complaints")
		complaints.Fields.Add(
			&core.RelationField{
				Name:          "customer_id",
				CollectionId:  customers.Id,
				Required:      true,
				CascadeDelete: true,
			},
			&core.TextField{Name: "item_name", Required: true},
			&core.TextField{Name: "serial_no"},
			&core.TextField{Name: "brand"},
			&core.TextField{Name: "model"},
			&core.TextField{Name: "password"},
			&core.TextField{Name: "accessories"},
			&core.TextField{Name: "issue", Required: true},
			&core.TextField{Name: "status", Required: false},
			&core.TextField{Name: "csr_number", Unique: true},
			&core.BoolField{Name: "flag_ok"},
			&core.BoolField{Name: "flag_r"},
			&core.BoolField{Name: "flag_w"},
			&core.BoolField{Name: "flag_p"},
			&core.TextField{Name: "service_type"},
			&core.TextField{Name: "service_mode"},
			&core.NumberField{Name: "is_device_intaken"},
			&core.TextField{Name: "warranty_details"},
			&core.TextField{Name: "warranty_status"},
			&core.TextField{Name: "created_by"},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		complaints.ListRule = types.Pointer("")
		complaints.ViewRule = types.Pointer("")
		complaints.CreateRule = types.Pointer("")
		complaints.UpdateRule = types.Pointer("")
		complaints.DeleteRule = types.Pointer("")
		if err := app.Save(complaints); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 4. service_records
		// ---------------------------------------------------------------
		serviceRecords := core.NewBaseCollection("service_records")
		serviceRecords.Fields.Add(
			&core.RelationField{
				Name:          "complaint_id",
				CollectionId:  complaints.Id,
				Required:      true,
				CascadeDelete: true,
			},
			&core.TextField{Name: "technician"},
			&core.TextField{Name: "issues"},
			&core.TextField{Name: "resolution_status"},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		serviceRecords.ListRule = types.Pointer("")
		serviceRecords.ViewRule = types.Pointer("")
		serviceRecords.CreateRule = types.Pointer("")
		serviceRecords.UpdateRule = types.Pointer("")
		serviceRecords.DeleteRule = types.Pointer("")
		if err := app.Save(serviceRecords); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 5. status_logs
		// ---------------------------------------------------------------
		statusLogs := core.NewBaseCollection("status_logs")
		statusLogs.Fields.Add(
			&core.RelationField{
				Name:          "complaint_id",
				CollectionId:  complaints.Id,
				Required:      true,
				CascadeDelete: true,
			},
			&core.TextField{Name: "status"},
			&core.TextField{Name: "technician"},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		statusLogs.ListRule = types.Pointer("")
		statusLogs.ViewRule = types.Pointer("")
		statusLogs.CreateRule = types.Pointer("")
		statusLogs.UpdateRule = types.Pointer("")
		statusLogs.DeleteRule = types.Pointer("")
		if err := app.Save(statusLogs); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 6. invoices
		// ---------------------------------------------------------------
		invoices := core.NewBaseCollection("invoices")
		invoices.Fields.Add(
			&core.RelationField{
				Name:          "complaint_id",
				CollectionId:  complaints.Id,
				Required:      true,
				CascadeDelete: true,
			},
			&core.TextField{Name: "receipt_number", Unique: true},
			&core.NumberField{Name: "service_fees"},
			&core.NumberField{Name: "part_costs"},
			&core.NumberField{Name: "total"},
			&core.JSONField{Name: "spares"},
			&core.TextField{Name: "warranty"},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		invoices.ListRule = types.Pointer("")
		invoices.ViewRule = types.Pointer("")
		invoices.CreateRule = types.Pointer("")
		invoices.UpdateRule = types.Pointer("")
		invoices.DeleteRule = types.Pointer("")
		if err := app.Save(invoices); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 7. settings
		// ---------------------------------------------------------------
		settings := core.NewBaseCollection("settings")
		settings.Fields.Add(
			&core.TextField{Name: "setting_key", Required: true, Unique: true},
			&core.TextField{Name: "setting_value"},
		)
		settings.ListRule = types.Pointer("")
		settings.ViewRule = types.Pointer("")
		settings.CreateRule = types.Pointer("")
		settings.UpdateRule = types.Pointer("")
		settings.DeleteRule = types.Pointer("")
		if err := app.Save(settings); err != nil {
			return err
		}

		// ---------------------------------------------------------------
		// 8. notifications
		// ---------------------------------------------------------------
		notifications := core.NewBaseCollection("notifications")
		notifications.Fields.Add(
			&core.TextField{Name: "message", Required: true},
			&core.RelationField{
				Name:         "complaint_id",
				CollectionId: complaints.Id,
			},
			&core.TextField{Name: "csr_number"},
			&core.TextField{Name: "created_by"},
			&core.BoolField{Name: "is_read"},
			&core.AutodateField{Name: "created_at", OnCreate: true},
		)
		notifications.ListRule = types.Pointer("")
		notifications.ViewRule = types.Pointer("")
		notifications.CreateRule = types.Pointer("")
		notifications.UpdateRule = types.Pointer("")
		notifications.DeleteRule = types.Pointer("")
		if err := app.Save(notifications); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		// Down migration — delete in reverse dependency order
		collectionNames := []string{
			"notifications", "settings", "invoices",
			"status_logs", "service_records", "complaints",
			"customers", "users",
		}
		for _, name := range collectionNames {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				continue
			}
			if err := app.Delete(collection); err != nil {
				return err
			}
		}
		return nil
	})
}
